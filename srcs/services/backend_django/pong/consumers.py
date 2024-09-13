import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'

        # Join game group
        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave game group
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action_type = text_data_json.get('action_type')

        if action_type == 'update_position':
            player_id = text_data_json['player_id']
            position = text_data_json['position']

            # Send position update to game group
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'game_update',
                    'player_id': player_id,
                    'position': position
                }
            )
        elif action_type == 'score_update':
            score = text_data_json['score']

            # Send score update to game group
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'score_update',
                    'score': score
                }
            )

    # Receive game update from game group
    async def game_update(self, event):
        player_id = event['player_id']
        position = event['position']

        # Send game update to WebSocket
        await self.send(text_data=json.dumps({
            'action_type': 'update_position',
            'player_id': player_id,
            'position': position
        }))

    # Receive score update from game group
    async def score_update(self, event):
        score = event['score']

        # Send score update to WebSocket
        await self.send(text_data=json.dumps({
            'action_type': 'score_update',
            'score': score
        }))