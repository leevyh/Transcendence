import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.db import models
import asyncio
from pong.classGame import PongGame, list_of_games
from pong.classTournament import Tournament, list_of_tournaments
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


#class tournament consumer qui va avec la class TournamentGame, en attendant les autres, a partir de 4, le tournoi peut commencer
class TournamentConsumer(AsyncWebsocketConsumer):

    players = []

    async def connect(self):
        await self.accept()

        player = self.scope['user']
        if player.is_authenticated:
            await self.findTournament(player)
        else:
            await self.close()

    async def findTournament(self, player):
        if (len(list_of_tournaments) == 0) :
            print("create tournament with user : ", player)
            tournament = Tournament()
            list_of_tournaments.append(tournament)
            self.tournament = tournament
            self.tournament.status = "waiting"
            self.tournament.player[0] = player
            self.tournament.channel_layer_player[0] = self.channel_name
            self.tournament.nbPlayers += 1
            self.current_player = 'player_1'
            self.tournament.channel_layer_player[0] = self.channel_name
            await self.send(text_data=json.dumps({
                'action_type': 'update_player_list',
                'players': [
                    {'nickname': player.nickname, 'id': player.id}
                    for player in self.tournament.player if player is not None
                ]
            }))
        elif (list_of_tournaments[0].nbPlayers < 4) :
            print("join tournament with user : ", player)
            self.tournament = list_of_tournaments[0]
            self.tournament.player[self.tournament.nbPlayers] = player
            self.tournament.channel_layer_player[self.tournament.nbPlayers] = self.channel_name
            self.tournament.nbPlayers += 1
            self.current_player = 'player_' + str(self.tournament.nbPlayers)
            await self.send(text_data=json.dumps({
                'action_type': 'update_player_list',
                'players': [
                    {'nickname': player.nickname, 'id': player.id}
                    for player in self.tournament.player if player is not None
                ]
            }))
        else :
            print("error no tournament available")
        if(self.tournament.nbPlayers == 4) :
            list_of_tournaments.pop(0)
            print("tournament with 4 players")
            tournament_database = await create_tournament(self.tournament.player[0], self.tournament.player[1], self.tournament.player[2], self.tournament.player[3])
            self.tournament.id = tournament_database.id
            tournament_database.is_active = True
            await self.channel_layer.group_add(f"tournament_{self.tournament.id}", self.tournament.channel_layer_player[0])
            await self.channel_layer.group_add(f"tournament_{self.tournament.id}", self.tournament.channel_layer_player[1])
            await self.channel_layer.group_add(f"tournament_{self.tournament.id}", self.tournament.channel_layer_player[2])
            await self.channel_layer.group_add(f"tournament_{self.tournament.id}", self.tournament.channel_layer_player[3])
            self.tournament.status = "ready"
            self.task = asyncio.create_task(self.tournament.start_tournament())
        return self.tournament

    async def disconnect(self):
        print("disconnect user : ", self.scope['user'])
        await self.close()

@sync_to_async
def create_tournament(player_1, player_2, player_3, player_4):
    from pong.models import Tournament
    return Tournament.objects.create(player_1=player_1, player_2=player_2, player_3=player_3, player_4=player_4, is_active=True)