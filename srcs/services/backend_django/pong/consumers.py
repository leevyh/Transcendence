import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.db import models
import asyncio
from pong.classGame import PongGame, list_of_games
from . import initValues as iv

# File d'attente pour le matchmaking
waiting_players = []

@sync_to_async
def create_game(player_1, player_2):
    from pong.models import Game
    return Game.objects.create(player_1=player_1, player_2=player_2, is_active=True)

class PongConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()

        # Add player to the matchmaking queue
        player = self.scope['user']
        if player.is_authenticated:
            await self.findMatch(player)
        else:
            await self.close()

    # cree une partie si le joueur est le premier a se connecter ou rejoint une partie si un autre joueur est deja connecte. return cette partie
    async def findMatch(self, player):
        if (len(list_of_games) == 0) :
            print("create game with user : ", player)
            game = PongGame(player)
            list_of_games.append(game)
            game.status = "waiting"
            game.player_1 = player
            game.nbPlayers += 1
            game.channel_player_1 = self.channel_name
            #envoyer au front si il doit ecouter le joueur 1 ou 2 sans passer par un groupe
            await self.send(text_data=json.dumps({
                'action_type': 'define_player',
                'current_player': 'player_1'
            }))
            self.game = game
        else :
            print("join game with user : ", player)
            game = list_of_games.pop(0)
            game.player_2 = player
            game.nbPlayers += 1   
            game.channel_player_2 = self.channel_name
            await self.send(text_data=json.dumps({
                'action_type': 'define_player',
                'current_player': 'player_2'
            }))
            await self.channel_layer.group_add(f"game_{game.id}", self.channel_name)
            self.game = game

        if(game.nbPlayers == 2) :
            print("game with 2 players")
            game_database = await create_game(game.player_1, game.player_2)
            game.id = game_database.id
            game_database.is_active = True
            await self.channel_layer.group_add(f"game_{game.id}", game.channel_player_1)
            await self.channel_layer.group_add(f"game_{game.id}", game.channel_player_2)
            game.status = "ready"
            self.task = asyncio.create_task(self.game.game_loop())
        return game

    async def game_state(self, event):
        # print("game state user : ", self.scope['user'])
        await self.send(text_data=json.dumps({
            'action_type': 'game_state',
            'game': event['game']
        }))

    #fonction pour envoyer start_game aux front par les deux joueurs, met la game en active, passe le statut en PLAYING
    async def start_game(self, event):
        print("start game user : ", self.scope['user'])
        self.game.status = "playing"
        await self.send(text_data=json.dumps({
            'action_type': 'start_game',
            'game': event['game']
        }))

    async def disconnect(self, close_code):
        # Retirer le joueur de la file d'attente s'il quitte la connexion
        print("disconnect user : ", self.scope['user'])
        player = self.scope['user']
        if player in waiting_players:
            waiting_players.remove(player)
        
        if hasattr(self, 'game'):
            self.game.is_active = False

        if hasattr(self, 'game_id'):
            await self.channel_layer.group_discard(f"game_{self.game_id}", self.channel_name)
        await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        # Update player positions or handle key events
        if data['type'] == 'update_player_position':
            self.game.move_player(data['player'], data['move'])
        # if data['type'] == 'game_started':
        #     await self.game.is_active = True
        if data['type'] == 'stop_game' :
            await self.game.stop_game()

    async def end_of_game(self, event):
        await self.send(text_data=json.dumps({
            'action_type': 'end_of_game',
        }))

