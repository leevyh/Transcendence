from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
     re_pathpath('ws/pong/', consumers.PongConsumer.as_asgi()),
     re_pathpath('ws/tournament/', consumers.TournamentConsumer.as_asgi()),
]