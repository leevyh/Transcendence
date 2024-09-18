from django.urls import path
from . import views

urlpatterns = [
    path('conversationID/<str:nickname>/', views.conversationID, name='conversationID'), # get conversation ID
    path('block/', views.block_user, name='block_user'), # block a user
    path('unblock/', views.unblock_user, name='unblock_user'), # unblock a user
]