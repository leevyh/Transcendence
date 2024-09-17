import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatMessagesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversationID']
        self.room_group_name = f'messages_{self.conversation_id}'

        # Joindre un groupe pour les messages de la conversation
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accepter la connexion WebSocket
        await self.accept()

    async def disconnect(self, close_code):
        # Quitter le groupe des messages de la conversation
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Recevoir un message du WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = text_data_json['sender']
        timestamp = text_data_json['timestamp']

        # Diffuser le message au groupe de messages
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender,
                'timestamp': timestamp
            }
        )

    # Recevoir un message du groupe de messages
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        timestamp = event['timestamp']

        # Envoyer le message à WebSocket avec l'identifiant de l'expéditeur
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'timestamp': timestamp,
        }))