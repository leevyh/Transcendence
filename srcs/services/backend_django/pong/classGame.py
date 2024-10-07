import asyncio
from datetime import datetime
from time import sleep
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from asgiref.sync import sync_to_async
from django.db import models
from . import initValues as iv

list_of_games = []

#class for a game with a ball and two players
class PongGame:
    def __init__(self, player1, *args, **kwargs):
        self.player_1 = 0
        self.player_2 = 0
        self.nbPlayers = 0
        self.player_1_score = 0
        self.player_2_score = 0
        self.ball_position_x = iv.GAME_WIDTH // 2
        self.ball_position_y = iv.GAME_HEIGHT // 2
        self.ball_speed_x = iv.BALL_SPEED_X
        self.ball_speed_y = iv.BALL_SPEED_Y
        self.player_1_position = iv.GAME_HEIGHT // 2
        self.player_2_position = iv.GAME_HEIGHT // 2
        self.is_active = False
        self.channel_player_1 = None
        self.channel_player_2 = None
        self.id = 0
        self.status = 0
        self.created_at = datetime.now()

    #loop for the game
    async def game_loop(self):
        print("game loop")
        if (self.is_active == False):
            if(self.status == "ready"):
                await self.start_game()
            elif (self.status == "finished"):
                await self.save_game()
        while self.is_active:
            await self.move_ball()
            await self.broadcastState()
            await asyncio.sleep(0.005)

    #start the game
    async def start_game(self):
        print("start game")
        self.is_active = True
        self.reset_ball()
        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_send(
            f"game_{self.id}",
            {
                'type': 'start_game',
                'game': {
                    'player_1_score': self.player_1_score,
                    'player_2_score': self.player_2_score,
                    'ball_position': {
                        'x': self.ball_position_x,
                        'y': self.ball_position_y
                    },
                    'player_1_position': self.player_1_position,
                    'player_2_position': self.player_2_position
                }
            }
        )

    #send all the informations about the game to the players
    async def broadcastState(self):
        # print("broadcast state")
        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_send(
            f"game_{self.id}",
            {
                'type': 'game_state',
                'game': {
                    'player_1_score': self.player_1_score,
                    'player_2_score': self.player_2_score,
                    'ball_position': {
                        'x': self.ball_position_x,
                        'y': self.ball_position_y
                    },
                    'player_1_position': self.player_1_position,
                    'player_2_position': self.player_2_position
                }
            }
        )
    
    #reset the ball position
    def reset_ball(self):
        print("reset ball")
        self.ball_position_x = iv.GAME_WIDTH // 2
        self.ball_position_y = iv.GAME_HEIGHT // 2
        self.ball_speed_x = iv.BALL_SPEED_X
        self.ball_speed_y = iv.BALL_SPEED_Y
    
    #move the ball
    async def move_ball(self):
        self.ball_position_x += self.ball_speed_x
        self.ball_position_y += self.ball_speed_y

        #check if the ball is colliding with the top or the bottom of the screen
        if self.ball_position_y <= 0 or self.ball_position_y >= iv.GAME_HEIGHT:
            self.ball_speed_y *= -1

        #check if the ball is colliding with the left or the right of the screen
        if self.ball_position_x <= 0:
            if self.ball_position_y > self.player_1_position and self.ball_position_y < self.player_1_position + iv.PADDLE_HEIGHT:
                self.ball_speed_x *= -1
                # collide(self.player_1_position)
            else:
                self.player_2_score += 1
                if self.player_2_score >= iv.WINNING_SCORE:
                    await self.stop_game()
                self.reset_ball()
        elif self.ball_position_x >= iv.GAME_WIDTH:
            if self.ball_position_y > self.player_2_position and self.ball_position_y < self.player_2_position + iv.PADDLE_HEIGHT:
                self.ball_speed_x *= -1
                # collide(self.player_2_position)
            else:
                self.player_1_score += 1
                if self.player_1_score >= iv.WINNING_SCORE:
                    await self.stop_game()
                self.reset_ball()
        
        #send the new ball position to the players
        self.broadcastState()
    
    def collide(self, paddle_position):
        self.ball_speed_x *= -1
        impact = self.ball_position_y - paddle_position - iv.PADDLE_HEIGHT / 2
        ratio = 100 / (iv.PADDLE_HEIGHT / 2)
        self.ball_speed_y = round(impact * ratio / 10)
    
    #move the player
    def move_player(self, player, move):
        if player == 'player_1':
            if move == "up":
                position = self.player_1_position - iv.PADDLE_SPEED
                self.player_1_position = max(0, position)
            elif move == "down":
                position = self.player_1_position + iv.PADDLE_SPEED
                self.player_1_position = min(iv.GAME_HEIGHT, position)
            # elif move == "stop":
            #     self.player_1_position = self.player_1_position
        else:
            if move == "up":
                position = self.player_2_position - iv.PADDLE_SPEED
                self.player_2_position = max(0, position)
            elif move == "down":
                position = self.player_2_position + iv.PADDLE_SPEED
                self.player_2_position = min(iv.GAME_HEIGHT, position)
            # elif move == "stop":
            #     self.player_2_position = self.player_2_position
        self.broadcastState()
    
    #stop the game
    async def stop_game(self):
        print("stop game")
        self.is_active = False
        self.status = "finished"
        self.reset_ball()
        await self.game_loop()

    #save the game in the database
    async def save_game(self):
        print("save game")
        # self.channel_layer = get_channel_layer()
        # await self.channel_layer.group_send(
        #     f"game_{self.id}",
        #     {'type': 'stop_game'}
        # )
        from pong.models import Game
        game_database = await sync_to_async(Game.objects.get, thread_sensitive=True)(id=self.id)
        game_database.player_1_score = self.player_1_score
        game_database.player_2_score = self.player_2_score
        game_database.is_active = False
        await sync_to_async(game_database.save, thread_sensitive=True)()


# #class for a ball  
# class Ball :
#     def __init__(self, *args, **kwargs):
#         self.position_x = position_x
#         self.position_y = position_y
#         self.speed_x = speed_x
#         self.speed_y = speed_y
    

# #class for a player
# class Paddle :
#     def __init__(self, player, *args, **kwargs):
#         self.position = 0
#         self.player = player
#         self.speed = 0