import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import base64

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        from chat.models import Message, Conversation, UserBlock
        from api.models import User_site as User

        # Check if user is authenticated
        if not self.scope['user'].is_authenticated:
            await self.close()
            return
        user = self.scope['user']

        # Get conversation ID
        self.conversation_id = self.scope['url_route']['kwargs']['conversationID']
        self.conversation_group_name = f'conversation_{self.conversation_id}'

        # Get conversation members and check for blocks
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)
        members = await database_sync_to_async(list)(conversation.members.all())

        for member in members:
            # Check if the user is blocked by any member
            is_blocked = await database_sync_to_async(lambda: UserBlock.objects.filter(blocker=member, blocked=user).exists())()
        if is_blocked:
            await self.close()  # Close the WebSocket if user is blocked
            return

        # Join conversation group
        await self.channel_layer.group_add(self.conversation_group_name, self.channel_name)

        # Accept the WebSocket connection
        await self.accept()

        # Send chat history
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)
        messages = await database_sync_to_async(list)(
            Message.objects.filter(conversation=conversation).order_by('timestamp').values('content', 'sender__username', 'timestamp')
        )

        # Convert avatars to base64
        for message in messages:
            sender = await database_sync_to_async(User.objects.get)(username=message['sender__username'])
            message['sender__avatar'] = encode_avatar(sender)

        # Send chat history to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_history',
            'messages': [
                {
                    'message': message['content'],
                    'sender': {
                        'username': message['sender__username'],
                        'avatar': message['sender__avatar'],
                    },
                    'user': user.nickname, # Who am I
                    'timestamp': str(message['timestamp'])
                } for message in messages
            ]
        }))


    async def disconnect(self, close_code):
        # Leave conversation group
        await self.channel_layer.group_discard(self.conversation_group_name, self.channel_name)


    async def receive(self, text_data):
        from chat.models import Message, Conversation, UserBlock
        from api.models import User_site as User

        # Receive message from WebSocket
        data = json.loads(text_data)
        message_content = data['message']
        sender = self.scope['user'].nickname
        timestamp = data['timestamp']

        # Get the current conversation
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)

        # Get the sender and conversation members
        sender = await database_sync_to_async(User.objects.get)(nickname=sender)
        members = await database_sync_to_async(list)(conversation.members.all())

        # Check if the sender is blocked by any member
        for member in members:
            is_blocked = await database_sync_to_async(lambda: UserBlock.objects.filter(blocker=member, blocked=sender).exists())()
            if is_blocked:
                # Optionally: Send a message back to the sender notifying them they are blocked
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': "You are blocked by a participant in this conversation."
                }))
                return

        # Proceed with saving the message and broadcasting to the group
        message = await database_sync_to_async(Message.objects.create)(
            conversation=conversation,
            sender=sender,
            content=message_content,
            timestamp=timestamp
        )

        # Convert sender avatar to base64
        sender_avatar_base64 = encode_avatar(sender)

        # Prepare message data to send to the group
        message_data = {
            'message': message.content,
            'sender': {
                'username': sender.nickname,
                'id': sender.id,
                'avatar': sender_avatar_base64,
            },
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
        user = self.scope['user']
        message_data = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message_data['message'],
            'sender': {
                'username': message_data['sender']['username'],
                'id': message_data['sender']['id'],
                'avatar': message_data['sender']['avatar'],
            },
            'user': user.username, # Who am I
            'timestamp': message_data['timestamp']
        }))


# Convert avatar to base64
def encode_avatar(user):
    if user.avatar:
        avatar_image = user.avatar.open()
        avatar_base64 = base64.b64encode(avatar_image.read()).decode('utf-8')
        avatar_image.close()
        return avatar_base64
    return None