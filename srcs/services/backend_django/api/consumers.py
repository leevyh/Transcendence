from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.db import models
import base64

class StatusConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("status_updates", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("status_updates", self.channel_name)

    async def receive(self, text_data):
        pass  # No need to handle incoming messages for status updates

    async def send_status_update(self, event):
        from .models import User_site
        message = event["message"]
        user = await database_sync_to_async(User_site.objects.get)(id=message['user_id'])
        avatar = user.avatar
        encoded_avatar = base64.b64encode(avatar.read()).decode('utf-8')
        await self.send_json({
            "type": "status_update",
            "user_id": message['user_id'],
            "nickname": message['nickname'],
            "status": message['status'],
            "avatar": encoded_avatar
        })
        # await self.send_json(event["message"])


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
            await self.handle_notification(content)

    async def handle_notification(self, data):
        from .models import User_site, FriendRequest, Friendship, Notification
        from chat.consumers import encode_avatar
        user = self.scope["user"]
        type = data['type']
        print(f"Data received: {data}")
        #if type is friend_request -> Save friend request with from_user and to_user, status pending
        if type == 'friend_request':
            nickname = data['nickname']
            friend = await database_sync_to_async(User_site.objects.get)(nickname=nickname)

            existing_friendship = await database_sync_to_async(lambda: Friendship.objects.filter(
                models.Q(user1=user, user2=friend) | models.Q(user1=friend, user2=user)
            ).exists())()
            if existing_friendship:
                await self.send_json({"error": "You are already friends with this user"})
                return

            existing_request = await database_sync_to_async(lambda: FriendRequest.objects.filter(
                models.Q(user=user, friend=friend) | models.Q(user=friend, friend=user)
            ).exists())()
            if existing_request:
                await self.send_json({"error": "A friend request is already pending between you and this user"})
                return

            friend_request = await database_sync_to_async(FriendRequest.objects.create)(user=user, friend=friend)

            await database_sync_to_async(Notification.objects.create)(
                user=friend,  # The recipient of the friend request
                type='friend_request',
                friend_request=friend_request,
                status='unread'
            )


            print(f"Friend request from {user.nickname} to {friend.nickname} created and saved in database")
            await self.channel_layer.group_send(
                f"user_{friend.id}",
                {
                    "type": "send_notification",
                    "message": {
                        "type": "friend_request",
                        "from_user": user.id,
                        "from_nickname": user.nickname,
                        "from_avatar": encode_avatar(user),
                    },
                },
            )


        elif type == 'accept_friend_request' or type == 'reject_friend_request':
            print(f"data: {data}")
            friend = await database_sync_to_async(User_site.objects.get)(nickname=data['nickname'])

            try:
                friend_request = await database_sync_to_async(FriendRequest.objects.get)(
                    user=friend, friend=user
                )
            except FriendRequest.DoesNotExist:
                await self.send_json({"error": "No friend request found"})
                return
            if (type == 'accept_friend_request'):
                await database_sync_to_async(Friendship.objects.create)(user1=user, user2=friend)
                await self.channel_layer.group_send(
                    f"user_{user.id}_friends",
                    {
                        "type": "send_new_friend_notification",
                        "message": {
                            "type": "new_friend_added",
                            "nickname": friend.nickname,
                            "user_id": friend.id,
                            "status": friend.status,
                            "avatar": base64.b64encode(friend.avatar.read()).decode('utf-8'),
                        }
                    }
                )
                await self.channel_layer.group_send(
                    f"user_{friend.id}_friends",
                    {
                        "type": "send_new_friend_notification",
                        "message": {
                            "type": "new_friend_added",
                            "nickname": user.nickname,
                            "user_id": user.id,
                            "status": user.status,
                            "avatar": base64.b64encode(user.avatar.read()).decode('utf-8'),
                        }
                    }
                )

            print(f"Friendship created between {user.nickname} and {friend.nickname}")

            await database_sync_to_async(lambda: Notification.objects.filter(friend_request=friend_request).delete())()
            await database_sync_to_async(friend_request.delete)()

        else:
            await self.close()

    async def send_notification(self, event):
        await self.send_json(event["message"])


class FriendShipConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return
        user = self.scope["user"]
        if user.is_authenticated:
            self.room_name = f"user_{user.id}_friends"
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
        type = ['game', 'new_friend', 'get_friends']
        if content['type'] in type:
            await self.handle_notification(content)

    async def handle_notification(self, data):
        from .models import User_site, Friendship, Notification
        from chat.consumers import encode_avatar
        user = self.scope["user"]
        type = data['type']
        if type == 'game':
            friend = await database_sync_to_async(User_site.objects.get)(nickname=data['nickname'])
            await self.channel_layer.group_send(
                f"user_{friend.id}",
                {
                    "type": "send_notification",
                    "message": {
                        "type": "game",
                        "from_user": user.id,
                        "from_nickname": user.nickname,
                        "from_avatar": encode_avatar(user),
                    }
                }
            )
        elif type == 'new_friend':
            friend = await database_sync_to_async(User_site.objects.get)(nickname=data['nickname'])
            await self.channel_layer.group_send(
                f"user_{friend.id}",
                {
                    "type": "send_notification",
                    "message": {
                        "type": "new_friend",
                        "from_user": user.id,
                        "from_nickname": user.nickname,
                        "from_avatar": encode_avatar(user),
                    }
                }
            )
        elif type == 'get_friends':
            friends = await database_sync_to_async(lambda: list(Friendship.objects.filter(
                models.Q(user1=user) | models.Q(user2=user)
            )))()

            friends_list = []
            for friend in friends:
                user1 = await database_sync_to_async(lambda: friend.user1)()
                user2 = await database_sync_to_async(lambda: friend.user2)()

                if user1 == user:
                    encoded_avatar = base64.b64encode(user2.avatar.read()).decode('utf-8')
                    friends_list.append({
                        'nickname': user2.nickname,
                        'avatar': encoded_avatar,
                        'status': user2.status
                    })
                else:
                    encoded_avatar = base64.b64encode(user1.avatar.read()).decode('utf-8')
                    friends_list.append({
                        'nickname': user1.nickname,
                        'avatar': encoded_avatar,
                        'status': user1.status
                    })
            await self.send_json({
                'type': 'get_friends',
                'friends': friends_list
            })
        else:
            await self.close()

    async def send_notification(self, event):
        await self.send_json(event["message"])

    async def send_new_friend_notification(self, event):
        await self.send_json(event["message"])

    async def send_friend_status_update(self, event):
        await self.send_json(event["message"])
