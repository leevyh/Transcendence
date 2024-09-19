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

        # Get conversation members
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)
        members = await database_sync_to_async(list)(conversation.members.all())

        # Check if the user is blocked by any member, or if the user has blocked any member
        blocked_user = False
        blocked = None
        blocker = None
        for member in members:
            # Check if the user is blocked by the member
            is_blocked = await database_sync_to_async(lambda: UserBlock.objects.filter(blocker=member, blocked=user).exists())()
            if is_blocked:
                blocked = user.nickname
                blocker = member.nickname
                blocked_user = True
                break
            # Check if the user has blocked the member
            is_blocked = await database_sync_to_async(lambda: UserBlock.objects.filter(blocker=user, blocked=member).exists())()
            if is_blocked:
                blocked = member.nickname
                blocker = user.nickname
                blocked_user = True
                break

        # Join conversation group
        await self.channel_layer.group_add(self.conversation_group_name, self.channel_name)
        await self.accept()

        # Send chat history
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)
        messages = await database_sync_to_async(list)(
            Message.objects.filter(conversation=conversation).order_by('timestamp').values('content', 'sender__nickname', 'timestamp')
        )

        # Convert avatars to base64
        for message in messages:
            sender = await database_sync_to_async(User.objects.get)(nickname=message['sender__nickname'])
            message['sender__avatar'] = encode_avatar(sender)

        # Send chat history to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_history',
            'messages': [
                {
                    'message': message['content'],
                    'sender': {
                        'nickname': message['sender__nickname'],
                        'avatar': message['sender__avatar'],
                    },
                    'user': user.nickname, # Who am I
                    'timestamp': str(message['timestamp'])
                } for message in messages
            ],
            'block': {
                'blocked_user': blocked_user,
                'blocked': blocked,
                'blocker': blocker,
                'user': user.nickname   # Who am I
            }
        }))


    async def disconnect(self, close_code):
        # Leave conversation group
        await self.channel_layer.group_discard(self.conversation_group_name, self.channel_name)


    async def receive(self, text_data):
        from chat.models import Message, Conversation, UserBlock
        from api.models import User_site as User

        # Receive message from WebSocket
        data = json.loads(text_data)
        message_type = data.get('type')
        sender = self.scope['user'].nickname

        if message_type == 'block_user':
            blocked = data.get('blocked')
            await self.handle_block_user(blocked)
        elif message_type == 'unblock_user':
            blocked = data.get('blocked')
            await self.handle_unblock_user(blocked)
        else:
            message_content = data['message']
            timestamp = data['timestamp']

            # Get the current conversation and the members
            conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)
            sender = await database_sync_to_async(User.objects.get)(nickname=sender)
            members = await database_sync_to_async(list)(conversation.members.all())

            # Check if the sender is blocked by any member
            for member in members:
                is_blocked = await database_sync_to_async(lambda: UserBlock.objects.filter(blocker=member, blocked=sender).exists())()
                if is_blocked:
                    await self.send(text_data=json.dumps({'type': 'blocked', 'blocker': member.nickname, 'blocked': sender.nickname}))
                    return

            # Proceed with saving the message and broadcasting to the group
            message = await database_sync_to_async(Message.objects.create)(
                conversation=conversation,
                sender=sender,
                content=message_content,
                timestamp=timestamp
            )

            # Prepare message data to send to the group
            sender_avatar_base64 = encode_avatar(sender)
            message_data = {
                'message': message.content,
                'sender': {
                    'nickname': sender.nickname,
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


    # Receive message from conversation group
    async def chat_message(self, event):
        user = self.scope['user']
        message_data = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message_data['message'],
            'sender': {
                'nickname': message_data['sender']['nickname'],
                'id': message_data['sender']['id'],
                'avatar': message_data['sender']['avatar'],
            },
            'user': user.nickname, # Who am I
            'timestamp': message_data['timestamp']
        }))


    # Save block in the database
    async def handle_block_user(self, blocked):
        from chat.models import UserBlock
        from api.models import User_site as User
    
        blocker = self.scope['user']
        blocked_user = await database_sync_to_async(User.objects.get)(nickname=blocked)

        # Check if a UserBlock entry already exists : 
        # 1/ The user I want to block is already blocked
        # 2/ I am already blocked by the user I want to block
        if await database_sync_to_async(UserBlock.objects.filter(blocker=blocker, blocked=blocked_user).exists)():
            return
        if await database_sync_to_async(UserBlock.objects.filter(blocker=blocked_user, blocked=blocker).exists)():
            return
        
        # Create a UserBlock entry
        await database_sync_to_async(UserBlock.objects.create)(blocker=blocker, blocked=blocked_user)

        # Send message to blocked user
        await self.channel_layer.group_send(
            self.conversation_group_name,
            {
                'type': 'block_user',
                'blocked': blocked_user.nickname,
                'blocker': blocker.nickname,
            }
        )


    # Save unblock in the database
    async def handle_unblock_user(self, blocked):
        from chat.models import UserBlock
        from api.models import User_site as User

        blocker = self.scope['user']
        blocked_user = await database_sync_to_async(User.objects.get)(nickname=blocked)

        # Check if the UserBlock entry exists
        if not await database_sync_to_async(UserBlock.objects.filter(blocker=blocker, blocked=blocked_user).exists)():
            return
        
        # Delete the UserBlock entry
        await database_sync_to_async(UserBlock.objects.filter(blocker=blocker, blocked=blocked_user).delete)()

        # Send message to unblocked user
        await self.channel_layer.group_send(
            self.conversation_group_name,
            {
                'type': 'unblock_user',
                'blocked': blocked_user.nickname,
                'blocker': blocker.nickname
            }
        )


    # Receive information about blocked users
    async def block_user(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_blocked',
            'blocked': event['blocked'],
            'blocker': event['blocker'],
            'user': self.scope['user'].nickname # Who am I
        }))


    # Receive information about unblocked users
    async def unblock_user(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_unblocked',
            'blocked': event['blocked'],
            'blocker': event['blocker'],
            'user': self.scope['user'].nickname # Who am I
        }))

# Convert avatar to base64
def encode_avatar(user):
    if user.avatar:
        avatar_image = user.avatar.open()
        avatar_base64 = base64.b64encode(avatar_image.read()).decode('utf-8')
        avatar_image.close()
        return avatar_base64
    return None