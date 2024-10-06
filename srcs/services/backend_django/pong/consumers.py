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
        if data['type'] == 'stop_game' :
            await self.game.stop_game()

    # async def update_player_position(self, player, position):
    #     if player == 'player1':
    #         self.game.player_1_position = position
    #     else:
    #         self.game.player_2_position = position

    #     # Envoie des positions mises à jour aux deux joueurs
    #     await self.channel_layer.group_send(
    #         f"game_{self.game_id}",
    #         {
    #             'type': 'update_positions',
    #             'player1_position': self.game.player_1_position,
    #             'player2_position': self.game.player_2_position,
    #         }
    #     )

    # async def move_ball(self):
    #     # Logique de mouvement de la balle
    #     self.game.ball_position_x += self.game.ball_speed_x
    #     self.game.ball_position_y += self.game.ball_speed_y

    #     # Vérifie les collisions
    #     if self.game.ball_position_y <= 0 or self.game.ball_position_y >= GAME_HEIGHT:
    #         self.game.ball_speed_y *= -1

    #     # Vérifie le score
    #     if self.game.ball_position_x <= 0:
    #         self.game.player_2_score += 1
    #         await self.reset_ball()
    #     elif self.game.ball_position_x >= GAME_WIDTH:
    #         self.game.player_1_score += 1
    #         await self.reset_ball()

    #     # Envoie la mise à jour de la position de la balle à tous les joueurs dans le groupe
    #     await self.channel_layer.group_send(
    #         f"game_{self.game_id}",
    #         {
    #             'type': 'update_ball_position',
    #             'ball_position': {
    #                 'x': self.game.ball_position_x,
    #                 'y': self.game.ball_position_y
    #             },
    #         }
    #     )
    #     # #send the ball position to the all players inside the group
    #     # await self.update_ball_position({
    #     #     'ball_position': {
    #     #         'x': self.game.ball_position_x,
    #     #         'y': self.game.ball_position_y
    #     #     }
    #     # })

    # #send the ball position to the all players inside the group
    # async def update_ball_position(self, event):
    #     ball_position = event['ball_position']

    #     await self.send(text_data=json.dumps({
    #         'action_type': 'update_ball_position',
    #         'ball_position': ball_position
    #     }))

    # async def reset_ball(self):
    #     # Réinitialise la position de la balle au centre
    #     self.game.ball_position_x = GAME_WIDTH // 2
    #     self.game.ball_position_y = GAME_HEIGHT // 2
    #     self.game.ball_speed_x = BALL_SPEED_X
    #     self.game.ball_speed_y = BALL_SPEED_Y