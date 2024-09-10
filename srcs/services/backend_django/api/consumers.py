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


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_authenticated:
            self.room_name = f"user_{user.id}"
            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        user = self.scope["user"]
        if user.is_authenticated:
            await self.channel_layer.group_discard(
                self.room_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        type = ['friend_request', 'game_invite', 'tournament_invite', 'friend_accept', 'friend_refuse', 'game_accept', 'game_refuse', 'tournament_accept', 'tournament_refuse']
        if data['type'] in type:
            # print(f"Notification type {data['type']} received")         # DEBUG
            await self.handle_notification(data)

    async def handle_notification(self, data):
        from .models import User_site, FriendRequest
        nickname = data['nickname']
        user = self.scope["user"]
        type = data['type']
        # print(f"Data received: {data}")         # DEBUG
        #if type is friend_request -> Save friend request with from_user and to_user, status pending
        if type == 'friend_request':
            friend = await database_sync_to_async(User_site.objects.get)(nickname=nickname)
            friend_request = await database_sync_to_async(FriendRequest.objects.create)(user=user, friend=friend)
            # print(f"Friend request from {user.nickname} to {friend.nickname} created and saved in database")         # DEBUG
            await self.channel_layer.group_send(
                f"user_{friend.id}",
                {
                    "type": "send_notification", #call function async send_notification
                    "message": {
                        "type": "friend_request",
                        "from_user": user.id,
                        "from_nickname": user.nickname,
                    },
                },
            )
        #else close the connection
        else:
            await self.close()

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["message"]))

class FriendRequestConsumer(AsyncWebsocketConsumer):
    pass