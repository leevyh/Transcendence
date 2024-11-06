from django.urls import path
from . import views

urlpatterns = [
    path('conversationID/<int:id>/', views.conversationID, name='conversationID'), # get conversation ID
]