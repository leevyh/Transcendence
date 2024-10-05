from django.urls import path
from . import views

urlpatterns = [
    path('conversationID/<str:nickname>/', views.conversationID, name='conversationID'), # get conversation ID
]