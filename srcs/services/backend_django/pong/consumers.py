import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.db import models
import asyncio

# Dimensions du terrain de jeu
GAME_WIDTH = 640
GAME_HEIGHT = 480

# Vitesse de la balle
BALL_SPEED_X = 3
BALL_SPEED_Y = 3

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
            if player not in waiting_players:
                waiting_players.append((player, self.channel_name))

            if len(waiting_players) >= 2:
                (player_1, channel_name_1) = waiting_players.pop(0)
                (player_2, channel_name_2) = waiting_players.pop(0)

                game = await create_game(player_1, player_2)

                self.game = game
                self.game_id = game.id

                # Initialize the group for the game
                await self.channel_layer.group_add(f"game_{self.game_id}", channel_name_1)
                await self.channel_layer.group_add(f"game_{self.game_id}", channel_name_2)

                #check if player 1 is on the group
                if self.channel_name == channel_name_1:
                    print(f"player_1 : {player_1}")

                #check if player 2 is on the group
                if self.channel_name == channel_name_2:
                    print(f"player_2 : {player_2}")

                #print all players inside the group in for loop
                for player in self.channel_layer.group_channels(f'game_{self.game_id}'):
                    print(f"player inside the group : {player}")


                await self.channel_layer.group_send(
                    f"game_{self.game_id}",
                    {
                        'type': 'start_game',
                        'game_id': game.id,
                        'player_1': player_1.username,
                        'player_2': player_2.username
                    }
                )
        else:
            await self.close()

    # Fonction de test
    async def test(self, event):
        print("test user : ", self.scope['user'])
        msg = event['msg']
        # current_player = 'player_1' if self.scope['user'].username == aaa else 'player_2'
        await self.send(text_data=json.dumps({
            'action_type': 'test',
            'msg': msg
            # 'current_player': current_player
        }))

    # Fonction pour démarrer le jeu
    async def start_game(self, event):
        game_id = event['game_id']
        player_1 = event['player_1']
        player_2 = event['player_2']
        current_player = 'player_1' if self.scope['user'].username == player_1 else 'player_2'

        print(f"all users : {self.scope['user']}, {player_1}, {player_2}")
       
        # Envoie du message aux deux joueurs pour démarrer le jeu
        await self.send(text_data=json.dumps({
            'action_type': 'start_game',
            'game_id': game_id,
            'player_1': player_1,
            'player_2': player_2,
            'current_player': current_player
        }))
        
        await asyncio.sleep(3)

        if hasattr(self, 'game'):
            while(self.game.is_active):
                await self.move_ball()
                await asyncio.sleep(2)

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
        if data['type'] == 'update_position':
            await self.update_player_position(data['player'], data['position'])

    async def update_player_position(self, player, position):
        if player == 'player1':
            self.game.player_1_position = position
        else:
            self.game.player_2_position = position

        # Envoie des positions mises à jour aux deux joueurs
        await self.channel_layer.group_send(
            f"game_{self.game_id}",
            {
                'type': 'update_positions',
                'player1_position': self.game.player_1_position,
                'player2_position': self.game.player_2_position,
            }
        )

    async def move_ball(self):
        # Logique de mouvement de la balle
        self.game.ball_position_x += self.game.ball_speed_x
        self.game.ball_position_y += self.game.ball_speed_y

        # Vérifie les collisions
        if self.game.ball_position_y <= 0 or self.game.ball_position_y >= GAME_HEIGHT:
            self.game.ball_speed_y *= -1

        # Vérifie le score
        if self.game.ball_position_x <= 0:
            self.game.player_2_score += 1
            await self.reset_ball()
        elif self.game.ball_position_x >= GAME_WIDTH:
            self.game.player_1_score += 1
            await self.reset_ball()

        # await self.channel_layer.group_add(f"game_{self.game.id}", self.channel_name)
        print(f"self.user in move ball : {self.scope['user']}")
        # print("channel_name : ", self.channel_name)
        print("game_id : ", self.game.id)
        # print(f"All users inside the group : {self.channel_layer.group_channels(f'game_{self.game.id}')}")
        
        # Envoie la mise à jour de la position de la balle à tous les joueurs dans le groupe
        print("user : ", self.scope['user']),
        await self.channel_layer.group_send(
            f"game_{self.game_id}",
            {
                'type': 'update_ball_position',
                'ball_position': {
                    'x': self.game.ball_position_x,
                    'y': self.game.ball_position_y
                },
            }
        )
        #send the ball position to the all players inside the group
        await self.update_ball_position({
            'ball_position': {
                'x': self.game.ball_position_x,
                'y': self.game.ball_position_y
            }
        })

    #send the ball position to the all players inside the group
    async def update_ball_position(self, event):
        ball_position = event['ball_position']

        print(f"self.name_player : {self.scope['user']}")
        await self.send(text_data=json.dumps({
            'action_type': 'update_ball_position',
            'ball_position': ball_position
        }))



    async def reset_ball(self):
        # Réinitialise la position de la balle au centre
        self.game.ball_position_x = GAME_WIDTH // 2
        self.game.ball_position_y = GAME_HEIGHT // 2
        self.game.ball_speed_x = BALL_SPEED_X
        self.game.ball_speed_y = BALL_SPEED_Y