# from django.urls import path
# from .views import chat_view, send_message

# urlpatterns = [
#     path('messages/<str:username>/', chat_view, name='chat_view'),
#     path('send/', send_message, name='send_message'),
# ]

from django.urls import path
from . import views

urlpatterns = [
    path('connected_users/', views.get_connected_users, name='get_connected_users'),
    path('messages/<int:conversation_id>/', views.get_messages, name='get_messages'),
    path('start_conversation/<int:user_id>/', views.start_conversation, name='start_conversation'),
    path('send_message/<int:conversation_id>/', views.send_message, name='send_message'),
    path('current_user/', views.current_user, name='current_user'),
]