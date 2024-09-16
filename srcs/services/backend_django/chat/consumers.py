import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.db import models

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversationID']
        self.conversation_group_name = f'conversation_{self.conversation_id}'

        # Join conversation group
        await self.channel_layer.group_add(
            self.conversation_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

        from chat.models import Conversation_History, Message, Conversation
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id) # good

        messages = await database_sync_to_async(list)(
            Message.objects.filter(conversation=conversation).order_by('timestamp').values('content', 'sender__username', 'timestamp')
        )

        await self.send(text_data=json.dumps({
            'type': 'chat_history',
            'messages': [
                {
                    'message': message['content'],
                    'sender': message['sender__username'],
                    'timestamp': str(message['timestamp'])
                } for message in messages
            ]
        }))


    async def disconnect(self, close_code):
        # Leave conversation group
        await self.channel_layer.group_discard(
            self.conversation_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        from chat.models import Conversation_History, Message, Conversation
        from api.models import User_site as User
        # Receive message from WebSocket
        data = json.loads(text_data)
        message_content = data['message']
        sender = data['sender']
        timestamp = data['timestamp']

        # Get conversation id to create a conversation history and add message to it
        conversation_id = self.conversation_id
        conversation = await database_sync_to_async(Conversation.objects.get)(id=conversation_id) # good

        sender = await database_sync_to_async(User.objects.get)(username=sender) # good
        message = await database_sync_to_async(Message.objects.create)(
            conversation=conversation,
            sender=sender,
            content=message_content,
            timestamp=timestamp
        )

        # Check if a Conversation_History exists, and create it if it doesn't
        history, created = await database_sync_to_async(Conversation_History.objects.get_or_create)(
            conversation=conversation
        )

        # Add the message to the conversation history
        await database_sync_to_async(history.messages.add)(message)

        print("SUCCESSFULLY ADDED MESSAGE TO CONVERSATION HISTORY")

        message_data = {
            'message': message.content,
            'sender': sender.username,
            'timestamp': str(message.timestamp)
        }

        await self.channel_layer.group_send(
            self.conversation_group_name,
            {
                'type': 'chat_message',
                'message': message_data
            }
        )

    async def chat_message(self, event):
        message_data = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'received_message',
            'message': message_data['message'],
            'sender': message_data['sender'],
            'timestamp': message_data['timestamp']
        }))