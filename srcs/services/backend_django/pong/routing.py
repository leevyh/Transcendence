from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
     path('ws/pong/', consumers.MatchmakingConsumer.as_asgi()),
]