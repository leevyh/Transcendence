#Routing.py is

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/status/$', consumers.StatusConsumer.as_asgi()),
    re_path(r'ws/friend_request/$', consumers.FriendRequestConsumer.as_asgi()),
]