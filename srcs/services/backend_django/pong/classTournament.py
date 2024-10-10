import asyncio
from datetime import datetime
from time import sleep
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from asgiref.sync import sync_to_async
from django.db import models
from . import initValues as iv
import random
from pong.classGame import PongGame
import uuid

list_of_tournaments = []

def generate_id():
    return str(uuid.uuid4())

#class for a tournament 4 players
class Tournament:
    def __init__(self, *args, **kwargs):
        self.player = [None] * 4
        self.nbPlayers = 0
        self.status = "waiting"
        self.id = 0
        self.semi_finals1 = None
        self.semi_finals2 = None
        self.small_final = None
        self.final = None
        self.channel_layer_player = [None] * 4

    #start the tournament
    async def start_tournament(self):
        print("start tournament")
        await self.create_semi_finals()
        await self.start_semi_finals()
        # await self.wait_for_games()
        # await self.create_small_final()
        # await self.create_final()
        # await self.start_finals()
        # await self.end_tournament()
  
    async def create_semi_finals(self):
        print("create semi_finals games")
        
        # Liste d'indices correspondant aux joueurs (de 0 à 3)
        player_indices = [0, 1, 2, 3]
        
        # Tirer au sort ces indices sans répétition
        random.shuffle(player_indices)
        
        # Associer les joueurs selon les indices tirés au sort
        for i in range(0, 4, 2):
            game1 = PongGame()
            game1.player_1 = self.player[player_indices[i]]
            game1.channel_player_1 = self.channel_layer_player[player_indices[i]]
            game1.player_2 = self.player[player_indices[i + 1]]
            game1.channel_player_2 = self.channel_layer_player[player_indices[i + 1]]
            game1.nbPlayers = 2
            game_database = await create_game(game1.player_1, game1.player_2)
            game1.id = game_database.id
            await self.channel_layer.group_add(f"game_{game1.id}", self.channel_layer_player[player_indices[i]])
            await self.channel_layer.group_add(f"game_{game1.id}", self.channel_layer_player[player_indices[i + 1]])
            self.semi_finals1 = game1
            #send a message to the front to say who is player1 and player2
            await self.channel_layer.group_send(
                f"game_{self.game1.id}",
                {
                    'type': 'define_player',
                }
            )
            self.semi_finals1.status = "ready"

            game2 = PongGame()
            game2.player_1 = self.player[player_indices[i + 2]]
            game2.channel_player_1 = self.channel_layer_player[player_indices[i + 2]]
            game2.player_2 = self.player[player_indices[i + 3]]
            game2.channel_player_2 = self.channel_layer_player[player_indices[i + 3]]
            game2.nbPlayers = 2
            game_database = await create_game(game2.player_1, game2.player_2)
            game2.id = game_database.id
            await self.channel_layer.group_add(f"game_{game2.id}", self.channel_layer_player[player_indices[i + 2]])
            await self.channel_layer.group_add(f"game_{game2.id}", self.channel_layer_player[player_indices[i + 3]])
            self.semi_finals2 = game2
            self.semi_finals2.status = "ready"

    async def start_semi_finals(self):
        print("start semi_finals")
        # await self.semi_finals1.game_loop()
        # await self.semi_finals2.game_loop()

    #wait for the games to finish
    async def wait_for_games(self):
        print("wait for games")
        while self.semi_finals1.is_active or self.semi_finals2.is_active:
            await asyncio.sleep(1)
        print("semi finals are finished")

    async def create_small_final(self):
        print("create small final")
        game = PongGame()
        game.player_1 = self.semi_finals1.winner
        game.player_2 = self.semi_finals2.winner
        game.channel_player_1 = self.semi_finals1.channel_player_1
        game.channel_player_2 = self.semi_finals2.channel_player_1
        game.nbPlayers = 2
        game_database = await create_game(game.player_1, game.player_2)
        game.id = game_database.id
        await self.channel_layer.group_add(f"game_{game.id}", game.channel_player_1)
        await self.channel_layer.group_add(f"game_{game.id}", game.channel_player_2)
        self.small_final = game
        self.small_final.status = "ready"

    async def create_final(self):
        print("create final")
        game = PongGame()
        game.player_1 = self.small_final.winner
        game.player_2 = self.small_final.loser
        game.channel_player_1 = self.small_final.channel_player_1
        game.channel_player_2 = self.small_final.channel_player_2
        game.nbPlayers = 2
        game_database = await create_game(game.player_1, game.player_2)
        game.id = game_database.id
        await self.channel_layer.group_add(f"game_{game.id}", game.channel_player_1)
        await self.channel_layer.group_add(f"game_{game.id}", game.channel_player_2)
        self.final = game
        self.final.status = "ready"

    async def start_finals(self):
        print("start finals")
        # await self.small_final.game_loop()
        # await self.final.game_loop()


    #end the tournament
    async def end_tournament(self):
        print("end tournament")
        #send the winner to the front
        #save the tournament in the database
        # from pong.models import Tournament
        # tournament_database = Tournament()
        # tournament_database.save()
        # from api.models import MatchHistory
        # match_history_player_1 = MatchHistory(player=self.player_1, tournament=tournament_database)
        # match_history_player_2 = MatchHistory(player=self.player_2, tournament=tournament_database)
        # match_history_player_3 = MatchHistory(player=self.player_3, tournament=tournament_database)
        # match_history_player_4 = MatchHistory(player=self.player_4, tournament=tournament_database)
        # await sync_to_async(match_history_player_1.save, thread_sensitive=True)()
        # await sync_to_async(match_history_player_2.save, thread_sensitive=True)()
        # await sync_to_async(match_history_player_3.save, thread_sensitive=True)()
        # await sync_to_async(match_history_player_4.save, thread_sensitive=True)()

        # #delete the games
        list_of_games.clear()
        print("tournament is finished")
