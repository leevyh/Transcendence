import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message
from .serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    serializer_class = MessageSerializer

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        text_data_json['room_name'] = self.room_name
        serializer = self.serializer_class(data=text_data_json)
        if serializer.is_valid():
            await self.save_message(serializer)
            user_id = serializer.data.get['user_id']
            message = serializer.data.get['message']
            date = serializer.data.get['date']
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, 
                {
                    'type': 'chat.message', 
                    'message': message,
                    'user_id': user_id,
                    'date': date,
                }
            )

    # Save message to database
    @sync_to_async
    def save_message(self, serializer):
        serializer.save()

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user_id = event['user_id']
        date = event['date']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(
            {
                'message': message,
                'user_id': user_id,
                'date': date,
            }
        ))
