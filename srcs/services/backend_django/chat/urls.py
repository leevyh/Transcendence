from django.urls import path
from . import views

urlpatterns = [
    path('history/', views.MessageList.as_view(), name='chat_history'),
    path('history/<str:nickname>/', views.MessageList.as_view(), name='user_chat_history'),
]