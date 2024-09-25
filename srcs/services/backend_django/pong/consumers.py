import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.db import models

# File d'attente pour le matchmaking
waiting_players = []

@sync_to_async
def create_game(player_1, player_2):
    from pong.models import Game
    return Game.objects.create(player_1=player_1, player_2=player_2, is_active=True)

class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accepter la connexion WebSocket
        await self.accept()

        # Ajouter le joueur dans la liste d'attente pour le matchmaking
        player = self.scope['user']  # On récupère l'utilisateur connecté
        if player.is_authenticated:
            waiting_players.append((player, self.channel_name))

            # Si deux joueurs sont en attente, créer une partie
            if len(waiting_players) >= 2:

                (player_1, channel_name_1) = waiting_players.pop(0)
                (player_2, channel_name_2) = waiting_players.pop(0)

                # Créer la partie dans la base de données
                print(f"Creating game between {player_1.username} and {player_2.username}")
                game = await create_game(player_1, player_2)

                self.game_id = game.id

                await self.channel_layer.group_add(f"game_{game.id}", channel_name_1)
                await self.channel_layer.group_add(f"game_{game.id}", channel_name_2)

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

    async def disconnect(self, close_code):
        # Retirer le joueur de la file d'attente s'il quitte la connexion
        player = self.scope['user']
        if player in waiting_players:
            waiting_players.remove(player)

        if hasattr(self, 'game_id'):
            await self.channel_layer.group_discard(f"game_{self.game_id}", self.channel_name)
        await self.close()

    # Fonction pour démarrer le jeu
    async def start_game(self, event):
        game_id = event['game_id']
        player_1 = event['player_1']
        player_2 = event['player_2']
        current_player = 'player_1' if self.scope['user'].username == player_1 else 'player_2'

        # Envoie du message aux deux joueurs pour démarrer le jeu
        await self.send(text_data=json.dumps({
            'action_type': 'start_game',
            'game_id': game_id,
            'player_1': player_1,
            'player_2': player_2,
            'current_player': current_player
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        action_type = data.get('action_type')

        if action_type == 'update_position':
            player_position = data.get('player_position')
            
            # Envoie la nouvelle position à l'autre joueur
            if hasattr(self, 'game_id'):
                await self.channel_layer.group_send(
                    f"game_{self.game_id}",
                    {
                        'type': 'update_opponent_position',
                        'player_position': player_position
                    }
                )

    # Fonction pour envoyer la position de l'autre joueur
    async def update_opponent_position(self, event):
        player_position = event['player_position']

        # Envoyer la position à l'adversaire
        await self.send(text_data=json.dumps({
            'action_type': 'update_opponent_position',
            'player_position': player_position
        }))