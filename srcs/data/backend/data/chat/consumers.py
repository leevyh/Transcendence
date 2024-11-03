import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
import base64

active_connections = {}

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Check if user is authenticated
        if not self.scope['user'].is_authenticated:
            await self.close()
            return
        user = self.scope['user']

        # Get conversation ID
        self.conversation_id = self.scope['url_route']['kwargs']['conversationID']
        self.conversation_group_name = f'conversation_{self.conversation_id}'

        # Join conversation group
        await self.channel_layer.group_add(self.conversation_group_name, self.channel_name)
        await self.accept()

        # Add inactive_connections -> Means the user is active in the chat
        active_connections[user.id] = self.channel_name

        # Check and remode any existing notifications for this conversation
        await self.remove_notifications(user, self.conversation_id)

        # Send chat history
        await self.chat_history()


    async def disconnect(self, close_code):
        # Leave conversation group
        user = self.scope['user']
        await self.channel_layer.group_discard(self.conversation_group_name, self.channel_name)

        # Remove from active_connections -> Means the user is not active in the chat
        if user.id in active_connections:
            del active_connections[user.id]

    async def receive(self, text_data):
        # Receive message from WebSocket
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'block_user':
            blocked = data.get('blocked')
            await self.handle_block_user(blocked)
        else:
            message = {
                'message': data['message'],
                'timestamp': data['timestamp']
            }
            await self.handle_message(message)


    # Handle history of messages
    async def chat_history(self):
        from chat.models import Message, Conversation, UserBlock
        from api.models import User_site as User
        user = self.scope['user']

        # Get the current conversation and the members
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)
        members = await database_sync_to_async(list)(conversation.members.all())
     
        # Get chat history
        messages = await database_sync_to_async(list)(
            Message.objects.filter(conversation=conversation).order_by('timestamp').values('content', 'sender__nickname', 'timestamp')
        )

        # Convert avatars to base64 for each sender
        for message in messages:
            sender = await database_sync_to_async(User.objects.get)(nickname=message['sender__nickname'])
            message['sender__avatar'] = encode_avatar(sender)


        # Get information about the other user in the conversation (only 2 members)
        other = [member for member in members if member.nickname != user.nickname][0]

        # Send chat history to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_history',
            'conversation': {   
                'me': {
                    'nickname': user.nickname,
                    'id': user.id,
                    'avatar': encode_avatar(user),
                    'blocked': await database_sync_to_async(lambda: UserBlock.objects.filter(blocker=other, blocked=user).exists())(),
                },
                'other': {
                    'nickname': other.nickname,
                    'id': other.id,
                    'avatar': encode_avatar(other),
                    'blocked': await database_sync_to_async(lambda: UserBlock.objects.filter(blocker=user, blocked=other).exists())(),
                },
            },
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
        }))
        

    # Handle message in the database
    async def handle_message(self, message):
        from chat.models import Message, Conversation, UserBlock
        from api.models import User_site as User
        user = self.scope['user']

        # Get the current conversation and the members
        conversation = await database_sync_to_async(Conversation.objects.get)(id=self.conversation_id)
        sender = await database_sync_to_async(User.objects.get)(nickname=user.nickname)
        members = await database_sync_to_async(list)(conversation.members.all())

        # Check if the sender is blocked by any member
        for member in members:
            is_blocked = await database_sync_to_async(lambda: UserBlock.objects.filter(blocker=member, blocked=sender).exists())()
            if is_blocked:
                await self.send(text_data=json.dumps({'type': 'blocked', 'blocker': member.id, 'blocked': sender.id}))
                return
            
        # Proceed with saving the message and broadcasting to the group
        message = await database_sync_to_async(Message.objects.create)(
            conversation=conversation,
            sender=sender,
            content=message['message'],
            timestamp=message['timestamp']
        )

        # Prepare message data to send to the group
        message_data = {
            'message': message.content,
            'sender': {
                'nickname': sender.nickname,
                'id': sender.id,
                'avatar': encode_avatar(sender),
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

        # Notify the other members of the conversation (except the sender)
        await self.send_message_notifications(sender, members, message)


    # Send message notifications to the members of the conversation
    async def send_message_notifications(self, sender, members, message):
        from api.models import Notification
        for member in members:
            if member.id != sender.id:  # Exclude the sender
                # Check if the user is active in the chat, if not -> send a notification
                if not await self.is_user_in_group(member.id):
                    #Save the notification in database
                    await database_sync_to_async(Notification.objects.create)(
                        user=member,
                        type='new_message',
                        new_message=message,
                        status='unread'
                    )
                    notification = await database_sync_to_async(Notification.objects.get)(user=member, new_message=message)
                    await self.channel_layer.group_send(
                        f"user_{member.id}",
                        {
                            "type": "send_notification",
                            "message": {
                                "type": "new_message",
                                "id": notification.id,
                                "from_user": sender.id,
                                "from_nickname": sender.nickname,
                                "from_avatar": encode_avatar(sender),
                                "message": message.content,
                                "created_at": notification.created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                            },
                        }
                    )


    # Remove notifications from the database
    async def remove_notifications(self, user, conversation_id):
        from api.models import Notification
        # Fetch all unread notifications related to this conversation for the user
        notifications = await sync_to_async(list)(Notification.objects.filter(
            user=user,
            type='new_message',
            new_message__conversation_id=conversation_id,
            status='unread'
        ))

        # Delete them from the database
        for notification in notifications:
            await sync_to_async(notification.delete)()


    # Check if the user is active in the chat
    async def is_user_in_group(self, user_id):
        return user_id in active_connections


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

        # If the UserBlock entry does not exist, create it
        if not await database_sync_to_async(UserBlock.objects.filter(blocker=blocker, blocked=blocked_user).exists)():
            await database_sync_to_async(UserBlock.objects.create)(blocker=blocker, blocked=blocked_user)
            await self.channel_layer.group_send(
                self.conversation_group_name,
                {
                    'type': 'block_user',
                    'blocked': blocked_user.id,
                    'blocker': blocker.id,
                }
            )
            return
        
        # If the UserBlock entry exists, delete it
        if await database_sync_to_async(UserBlock.objects.filter(blocker=blocker, blocked=blocked_user).exists)():
            await database_sync_to_async(UserBlock.objects.filter(blocker=blocker, blocked=blocked_user).delete)()
            await self.channel_layer.group_send(
                self.conversation_group_name,
                {
                    'type': 'unblock_user',
                    'blocked': blocked_user.id,
                    'blocker': blocker.id
                }
            )
            return


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
