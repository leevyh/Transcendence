import json
from channels.generic.websocket import AsyncWebsocketConsumer

# File d'attente pour le matchmaking
queue = []

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accepter la connexion WebSocket
        await self.accept()
        self.player_id = None  # Identifiant du joueur

    async def disconnect(self, close_code):
        # Si le joueur est dans la file d'attente, le retirer
        if self in queue:
            queue.remove(self)

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data['action_type'] == 'join_queue':
            # Ajouter le joueur à la file d'attente
            await self.join_queue()

    async def join_queue(self):
        # Ajouter le joueur à la file d'attente
        queue.append(self)

        # Si un autre joueur est dans la file d'attente, démarrer une partie
        if len(queue) >= 2:
            player1 = queue.pop(0)  # Le premier joueur
            player2 = queue.pop(0)  # Le deuxième joueur

            # Démarrer une partie en informant les deux joueurs
            await player1.start_game()
            await player2.start_game()

    async def start_game(self):
        # Envoyer un message pour démarrer le jeu
        await self.send(text_data=json.dumps({
            'action_type': 'start_game',
        }))
