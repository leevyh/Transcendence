from django.urls import re_path
from api import consumers
from chat import consumers as chat_consumers

websocket_urlpatterns = [
    re_path(r'ws/status/$', consumers.StatusConsumer.as_asgi()),
    re_path(r'ws/friend_request/$', consumers.FriendRequestConsumer.as_asgi()),

    # re_path(r'ws/(?P<conversationID>\w+)/$', chat_consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/(?P<conversationID>\w+)/messages/$', chat_consumers.ChatMessagesConsumer.as_asgi()),
]