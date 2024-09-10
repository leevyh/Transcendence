from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async


class StatusConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("status_updates", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("status_updates", self.channel_name)

    async def receive(self, text_data):
        pass  # No need to handle incoming messages for status updates

    async def send_status_update(self, event):
        await self.send_json(event["message"])


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return
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

    async def receive_json(self, content):
        type = ['friend_request', 'game_invite', 'tournament_invite', 'accept_friend_request', 'reject_friend_request', 'game_accept', 'game_refuse', 'tournament_accept', 'tournament_refuse']
        if content['type'] in type:
            # print(f"Notification type {content['type']} received")         # DEBUG
            await self.handle_notification(content)

    async def handle_notification(self, data):
        from .models import User_site, FriendRequest
        user = self.scope["user"]
        type = data['type']
        print(f"Data received: {data}")
        #if type is friend_request -> Save friend request with from_user and to_user, status pending
        if type == 'friend_request':
            if not data['url'] == 'friends':
                await self.send_json({"error": "You can only send friend requests from the friends page"})
                return

            nickname = data['nickname']
            friend = await database_sync_to_async(User_site.objects.get)(nickname=nickname)
            friend_request = await database_sync_to_async(FriendRequest.objects.create)(user=user, friend=friend)
            print(f"Friend request from {user.nickname} to {friend.nickname} created and saved in database")
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
        elif type == 'accept_friend_request' or type == 'reject_friend_request':
            # console.log("data", data)
            print(f"data: {data}")
            #data type = accept_friend_request
            #data nickname = nickname sender of the friend request

            friend = await database_sync_to_async(User_site.objects.get)(nickname=data['nickname'])
            #edit friend request status to accepted
            friend_request = await database_sync_to_async(FriendRequest.objects.get)(user=friend, friend=user)
            friend_request.status = 'accepted' if type == 'accept_friend_request' else 'refused'
            await database_sync_to_async(friend_request.save)()
            print(f"Status of friend request change to {friend_request.status}")
            #send notification to the sender of the friend request
            await self.channel_layer.group_send(
                f"user_{friend.id}",
                {
                    "type": "send_notification",
                    "message": {
                        "type": "accept_friend_request",
                        "from_user": user.id,
                        "from_nickname": user.nickname,
                    },
                },
            )
        else:
            await self.close()

    async def send_notification(self, event):
        await self.send_json(event["message"])

# class FriendRequestConsumer(AsyncWebsocketConsumer):
#     pass