from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async


class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("status_updates", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("status_updates", self.channel_name)

    async def receive(self, text_data):
        pass  # No need to handle incoming messages for status updates

    async def send_status_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))


# srcs/services/backend_django/api/consumers.py

class FriendRequestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(f'Connecting to {self.channel_name}')
        user = self.scope['user']
        if user.is_authenticated:
            self.room_name = f"user_{user.id}"
            print(f'Adding {self.channel_name} to {self.room_name}')
            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        print(f'Disconnecting from {self.channel_name}')
        user = self.scope['user']
        if user.is_authenticated:
            await self.channel_layer.group_discard(
                f"user_{user.id}",
                self.channel_name
            )

    async def receive(self, text_data):
        print(f'Receiving message from {self.channel_name}')
        data = json.loads(text_data)
        if data['type'] == 'friend_request':
            await self.handle_friend_request(data)
        elif data['type'] == 'friend_request_response':
            await self.handle_friend_request_response(data)
        else:
            #close the connection
            await self.close()

    async def handle_friend_request(self, data):
        from .models import User_site, Friend_Request
        print(f'Handling friend request from {self.room_name}')
        nickname = data['nickname']
        user = self.scope['user']
        friend = await database_sync_to_async(User_site.objects.get)(nickname=nickname)

        existing_request = await database_sync_to_async(Friend_Request.objects.filter)(
            user=user, friend=friend, status=['pending', 'accepted']).exists()

        if existing_request:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Friend request already sent or accepted'
            }))
            return

        await database_sync_to_async(Friend_Request.objects.create)(
            user=user, friend=friend
        )
        print(f"friend {friend}")
        print(f"Nickname of friend {friend.nickname}")
        await self.channel_layer.group_send(
            f"user_{friend.id}",
            {
                "type": "send_friend_request",
                "message": {
                    "nickname": user.nickname,
                    "user_id": user.id,
                    "type": "friend_request",
                },
            },
        )
        print(f"Sent friend request to {friend.nickname}")

    async def handle_friend_request_response(self, data):
        from .models import User_site, Friend_Request

        print(f'Handling friend request response from {self.room_name}')
        user_id = data['user_id']
        accepted = data['accepted']
        user = self.scope['user']
        friend_request = await database_sync_to_async(Friend_Request.objects.get)(
            user_id=user_id, friend=user
        )
        friend_request.accepted = accepted
        await database_sync_to_async(friend_request.save)()
        await self.channel_layer.group_send(
            f"user_{user_id}",
            {
                "type": "send_friend_request_response",
                "message": {
                    "nickname": user.nickname,
                    "accepted": accepted,
                    "type": "friend_request_response",
                },
            },
        )

    async def send_friend_request(self, event):
        print(f'Sending friend request to {self.room_name}')
        await self.send(text_data=json.dumps(event["message"]))

    async def send_friend_request_response(self, event):
        print(f'Sending friend request response to {self.room_name}')
        await self.send(text_data=json.dumps(event["message"]))
