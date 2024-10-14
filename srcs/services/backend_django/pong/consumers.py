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
        # if player.status == 'ingame':
        #     return
        if (len(list_of_games) == 0) :
            print("create game with user : ", player)
            game = PongGame(player)
            list_of_games.append(game)
            game.status = "waiting"
            game.player_1 = player
            # player.status = 'ingame'
            game.nbPlayers += 1
            game.channel_player_1 = self.channel_name
            await self.send(text_data=json.dumps({
                'action_type': 'define_player',
                'current_player': 'player_1'
            }))
            self.game = game
        else :
            if list_of_games[0].player_1 == player :
                return
            print("join game with user : ", player)
            game = list_of_games.pop(0)
            game.player_2 = player
            # player.status = 'ingame'
            game.nbPlayers += 1   
            game.channel_player_2 = self.channel_name
            await self.send(text_data=json.dumps({
                'action_type': 'define_player',
                'current_player': 'player_2'
            }))
            # await self.channel_layer.group_add(f"game_{game.id}", self.channel_name)
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
        # self.game.status = "playing"
        await self.send(text_data=json.dumps({
            'action_type': 'start_game',
            'game': event['game']
        }))

    async def disconnect(self, code):
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
        # print("user : ", self.scope['user'])
        if player.is_authenticated:
            await self.findTournament(player)
        else:
            await self.close()

    async def websocket_send(self, event):
        text_data = event['text']
        await self.send(text_data=text_data)

    async def findTournament(self, player):
        # if player.status == 'intournament':
        #     print("player already in tournament")
            # return
        if (len(list_of_tournaments) == 0) :
            # print("create tournament with user : ", player)
            tournament = Tournament()
            list_of_tournaments.append(tournament)
            self.tournament = tournament
            self.tournament.status = "waiting"
        if (list_of_tournaments[0].nbPlayers < 4) :
            self.tournament = list_of_tournaments[0]
            for player_in_tournament in list_of_tournaments[0].player:
                if player_in_tournament == player:
                        print("player already in THIS tournament")
                        return
            for i in range(4):
                if self.tournament.player[i] is None:
                    # print("join tournament with user : ", player)
                    self.tournament.player[i] = player
                    self.tournament.channel_layer_player[i] = self.channel_name
                    # print("channel layer : ", self.tournament.channel_layer_player[i], "for player : ", self.tournament.player[i])
                    self.tournament.nbPlayers += 1
                    self.current_player = 'player_' + str(i+1)
                    await self.update_player_list(self.tournament)
                    break
        else :
            print("error no tournament available")
        if(self.tournament.nbPlayers == 4) :
            list_of_tournaments.pop(0)
            # print("tournament with 4 players")
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

    async def disconnect(self, code):
        # print("disconnect user : ", self.scope['user'])
        # retirer le joueur du tournoi s'il quitte la connexion
        player = self.scope['user']
        if player in self.tournament.player:
            self.tournament.player[self.tournament.player.index(player)] = None
            self.tournament.nbPlayers -= 1
            for i in range(4):
                if self.tournament.channel_layer_player[i] == self.channel_name:
                    self.tournament.channel_layer_player[i] = None
                    break
            if hasattr(self, 'tournament_id'):
                await self.channel_layer.group_discard(f"tournament_{self.tournament_id}", self.channel_name)
            await self.update_player_list(self.tournament)
        await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)

    async def update_player_list(self, event):
        players_in_tournament = [
            player for player in self.tournament.player if player is not None
        ]
        for i, player in enumerate(players_in_tournament):
            if self.tournament.channel_layer_player[i] is not None:
                await self.channel_layer.send(self.tournament.channel_layer_player[i], {
                    "type": "websocket.send",
                    'text': json.dumps({
                        'action_type': 'update_player_list',
                        'current_player': f'player_{i + 1}',
                        'players': [
                            {'nickname': p.nickname, 'id': p.id}
                            for p in players_in_tournament
                        ]
                    })
                })
        if event.nbPlayers == 0:
            print("No player left in the tournament")
            return

    async def start_tournament(self, event):
        await self.send(text_data=json.dumps({
            'action_type': 'start_tournament',
        }))

    async def show_game(self, event):
        await self.send(text_data=json.dumps({
            'action_type': 'show_game',
        }))

    async def start_game(self, event):
        # print("start game user : ", self.scope['user'])
        # self.game.status = "playing"
        await self.send(text_data=json.dumps({
            'action_type': 'start_game',
            'game': event['game']
        }))

    async def game_state(self, event):
        await self.send(text_data=json.dumps({
            'action_type': 'game_state',
            'game': event['game']
        }))

    async def define_player(self, event):
        await self.send(text_data=json.dumps({
            'action_type': 'define_player',
            'current_player': event['current_player']
        }))
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'update_player_position':
            await self.tournament.move_player(data['player'], data['move'])
        if data['type'] == 'stop_game' :
            await self.game.stop_game()

    async def end_of_game(self, event):
        await self.send(text_data=json.dumps({
            'action_type': 'end_of_game',
        }))

@sync_to_async
def create_tournament(player_1, player_2, player_3, player_4):
    from pong.models import Tournament
    return Tournament.objects.create(player_1=player_1, player_2=player_2, player_3=player_3, player_4=player_4, is_active=True)