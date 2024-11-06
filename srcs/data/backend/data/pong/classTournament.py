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
        self.resigned_players = []

    #start the tournament
    async def start_tournament(self):
        # print("start tournament")
        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_send(
            f"tournament_{self.id}",
            {
                'type': 'start_tournament',
            }
        )
        
        await self.create_semi_finals()
        await asyncio.sleep(2)
        await self.start_semi_finals()
        await self.wait_for_games()
        # if self.resigned_players:
        #     print("resigned players", self.resigned_players[0].nickname)
        await self.create_small_final()
        await self.create_final()
        await self.start_finals()
        await self.wait_for_games()
        await self.end_tournament()
  
    async def create_semi_finals(self):
        # print("create semi_finals games")
        
        # Liste d'indices correspondant aux joueurs (de 0 à 3)
        player_indices = [0, 1, 2, 3]
        
        # Tirer au sort ces indices sans répétition
        random.shuffle(player_indices)
        
        self.semi_finals1 = PongGame(self.player[player_indices[0]])
        self.semi_finals1.player_1 = self.player[player_indices[0]]
        self.semi_finals1.channel_player_1 = self.channel_layer_player[player_indices[0]]
        self.semi_finals1.player_2 = self.player[player_indices[1]]
        self.semi_finals1.channel_player_2 = self.channel_layer_player[player_indices[1]]
        self.semi_finals1.intournament = True
        self.semi_finals1.name = "semi_finals1"
        self.semi_finals1.nbPlayers = 2

        from pong.consumers import create_game
        game_database = await create_game(self.semi_finals1.player_1, self.semi_finals1.player_2)
        self.semi_finals1.id = game_database.id
        await self.channel_layer.group_add(f"game_{self.semi_finals1.id}", self.channel_layer_player[player_indices[0]])
        await self.channel_layer.group_add(f"game_{self.semi_finals1.id}", self.channel_layer_player[player_indices[1]])
        self.semi_finals1.status = "ready"

        # print("semi_finals1", self.semi_finals1.player_1, self.semi_finals1.player_2)

        self.semi_finals2 = PongGame(self.player[player_indices[2]])
        self.semi_finals2.player_1 = self.player[player_indices[2]]
        self.semi_finals2.channel_player_1 = self.channel_layer_player[player_indices[2]]
        self.semi_finals2.player_2 = self.player[player_indices[3]]
        self.semi_finals2.channel_player_2 = self.channel_layer_player[player_indices[3]]
        self.semi_finals2.intournament = True
        self.semi_finals2.name = "semi_finals2"
        self.semi_finals2.nbPlayers = 2

        game_database = await create_game(self.semi_finals2.player_1, self.semi_finals2.player_2)
        self.semi_finals2.id = game_database.id
        await self.channel_layer.group_add(f"game_{self.semi_finals2.id}", self.channel_layer_player[player_indices[2]])
        await self.channel_layer.group_add(f"game_{self.semi_finals2.id}", self.channel_layer_player[player_indices[3]])
        self.semi_finals2.status = "ready"

        # print("semi_finals2", self.semi_finals2.player_1, self.semi_finals2.player_2)

    async def start_semi_finals(self):
        # print("start semi_finals")
        self.status = "semi_finals"
        await self.channel_layer.group_send(
            f"game_{self.semi_finals1.id}",
            {
                'type': 'show_game',
            }
        )
        await self.channel_layer.group_send(
            f"game_{self.semi_finals2.id}",
            {
                'type': 'show_game',
            }
        )
        await asyncio.sleep(1)
        await self.send_define_player(self.semi_finals1, 'player_1', 'player_2')
        await self.send_define_player(self.semi_finals2, 'player_1', 'player_2')
        await asyncio.gather(
            self.semi_finals1.game_loop(),
            self.semi_finals2.game_loop()
        )

    #wait for the games to finish
    async def wait_for_games(self):
        # print("wait for games")
        if self.status == "semi_finals":
            while self.semi_finals1.is_active or self.semi_finals2.is_active:
                await asyncio.sleep(1)
        elif self.status == "finals":
            while self.small_final.is_active or self.final.is_active:
                await asyncio.sleep(1)
        await asyncio.sleep(4)

    #create the small_final game
    async def create_small_final(self):
                
        self.small_final = PongGame(self.semi_finals1.loser)
        self.small_final.player_1 = self.semi_finals1.loser
        self.small_final.player_2 = self.semi_finals2.loser
        self.small_final.channel_player_1 = self.semi_finals1.channel_loser
        self.small_final.channel_player_2 = self.semi_finals2.channel_loser
        self.small_final.intournament = True
        self.small_final.name = "small_final"
        self.small_final.nbPlayers = 2

        from pong.consumers import create_game
        game_database = await create_game(self.small_final.player_1, self.small_final.player_2)
        self.small_final.id = game_database.id
        await self.channel_layer.group_add(f"game_{self.small_final.id}", self.small_final.channel_player_1)
        await self.channel_layer.group_add(f"game_{self.small_final.id}", self.small_final.channel_player_2)
        self.small_final.status = "ready"

        # print("small final", self.small_final.player_1, self.small_final.player_2)

    #create the final game
    async def create_final(self):

        self.final = PongGame(self.semi_finals1.winner)
        self.final.player_1 = self.semi_finals1.winner
        self.final.player_2 = self.semi_finals2.winner
        self.final.channel_player_1 = self.semi_finals1.channel_winner
        self.final.channel_player_2 = self.semi_finals2.channel_winner
        self.final.intournament = True
        self.final.name = "final"
        self.final.nbPlayers = 2

        from pong.consumers import create_game
        game_database = await create_game(self.final.player_1, self.final.player_2)
        self.final.id = game_database.id
        await self.channel_layer.group_add(f"game_{self.final.id}", self.final.channel_player_1)
        await self.channel_layer.group_add(f"game_{self.final.id}", self.final.channel_player_2)
        self.final.status = "ready"

        # print("final", self.final.player_1, self.final.player_2)

    #start the finals
    async def start_finals(self):
        # print("start finals")
        self.status = "finals"
        await self.channel_layer.group_send(
            f"game_{self.small_final.id}",
            {
                'type': 'show_game',
            }
        )
        await self.channel_layer.group_send(
            f"game_{self.final.id}",
            {
                'type': 'show_game',
            }
        )

        tasks = []

        #if a resigned player is not null
        for player in self.resigned_players:
            if player == self.small_final.player_1:
                if self.small_final.winner == None:
                    self.small_final.winner = self.small_final.player_2
                    self.small_final.loser = self.small_final.player_1
            elif player == self.small_final.player_2:
                if self.small_final.winner == None:
                    self.small_final.winner = self.small_final.player_1
                    self.small_final.loser = self.small_final.player_2
            if player == self.final.player_1:
                if self.final.winner == None:
                    self.final.winner = self.final.player_2
                    self.final.loser = self.final.player_1
            elif player == self.final.player_2:
                if self.final.winner == None:
                    self.final.winner = self.final.player_1
                    self.final.loser = self.final.player_2

        if self.small_final.winner == None:
            await self.send_define_player(self.small_final, 'player_1', 'player_2')
            tasks.append(self.small_final.game_loop())

        if self.final.winner == None:  
            await self.send_define_player(self.final, 'player_1', 'player_2')
            tasks.append(self.final.game_loop())
       
        await asyncio.gather(*tasks)

    async def send_define_player(self, game, current_player_1, current_player_2):
        # print("send define player between", game.player_1, game.player_2)
        await self.channel_layer.send(
            game.channel_player_1,
            {
                'type': 'define_player',
                'name_player': game.player_1.nickname,
                'current_player': current_player_1,
                'game': game.name
            }
        )
        await self.channel_layer.send(
            game.channel_player_2,
            {
                'type': 'define_player',
                'name_player': game.player_2.nickname,
                'current_player': current_player_2,
                'game': game.name
            }
        )

    def move_player(self, player, move, player_name, game):
        if game == self.semi_finals1.name:
            self.semi_finals1.move_player(player, move)
        elif game == self.semi_finals2.name:
            self.semi_finals2.move_player(player, move)
        elif game == self.small_final.name:
            self.small_final.move_player(player, move)
        elif game == self.final.name:
            self.final.move_player(player, move)

    async def stop_game(self, game):
        # print("stop game")
        if game == self.semi_finals1.name:
            await self.semi_finals1.stop_game()
        elif game == self.semi_finals2.name:
            await self.semi_finals2.stop_game()
        elif game == self.small_final.name:
            await self.small_final.stop_game()
        elif game == self.final.name:
            await self.final.stop_game()

    #end the tournament
    async def end_tournament(self):
        # print("end tournament")

        # print("small final winner", self.small_final.winner)
        # print("small final loser", self.small_final.loser)
        # print("final winner", self.final.winner)
        # print("final loser", self.final.loser)

        self.status = "finished"
        #send the winner to the front
        await self.channel_layer.group_send(
            f"tournament_{self.id}",
            {
                'type': 'final_results',
                'ranking': {
                    'first': self.final.winner.nickname,
                    'second': self.final.loser.nickname,
                    'third': self.small_final.winner.nickname,
                    'fourth': self.small_final.loser.nickname
                }
            }
        )
        await self.save_tournament()
        await asyncio.sleep(7)
        await self.channel_layer.group_send(
            f"tournament_{self.id}",
            {
                'type': 'end_of_tournament'
            }
        )
            
    #save the tournament in the database
    async def save_tournament(self):

        from pong.models import Tournament
        tournament_database = await sync_to_async(Tournament.objects.get, thread_sensitive=True)(id=self.id)
        tournament_database.is_active = False
        tournament_database.winner = self.final.winner
        tournament_database.loser = self.final.loser
        await sync_to_async(tournament_database.save, thread_sensitive=True)()

        from api.models import TournamentHistory
        tournament_history_player_1 = TournamentHistory(player=self.player[0], tournament=tournament_database)
        tournament_history_player_2 = TournamentHistory(player=self.player[1], tournament=tournament_database)
        tournament_history_player_3 = TournamentHistory(player=self.player[2], tournament=tournament_database)
        tournament_history_player_4 = TournamentHistory(player=self.player[3], tournament=tournament_database)
        await sync_to_async(tournament_history_player_1.save, thread_sensitive=True)()
        await sync_to_async(tournament_history_player_2.save, thread_sensitive=True)()
        await sync_to_async(tournament_history_player_3.save, thread_sensitive=True)()
        await sync_to_async(tournament_history_player_4.save, thread_sensitive=True)()

        # print("tournament is finished")
