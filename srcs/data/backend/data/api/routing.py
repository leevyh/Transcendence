#Routing.py is

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'wss/status/$', consumers.StatusConsumer.as_asgi()),
    re_path(r'wss/friend_request/$', consumers.FriendRequestConsumer.as_asgi()),
]