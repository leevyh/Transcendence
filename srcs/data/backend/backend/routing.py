from django.urls import re_path
from api import consumers
from chat import consumers as chat_consumers

websocket_urlpatterns = [
    re_path(r'wss/status/$', consumers.StatusConsumer.as_asgi()),
    re_path(r'wss/friend_request/$', consumers.NotificationConsumer.as_asgi()),
    re_path(r'wss/(?P<conversationID>\w+)/messages/$', chat_consumers.ChatMessagesConsumer.as_asgi()),
]