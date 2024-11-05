from django.urls import path
from . import views

urlpatterns = [
    path('pong/', views.pong_view, name='pong'),
    path('tournament/', views.tournament_view, name='tournament'),
    path('pongSolo/', views.pongSolo_view, name='pongSolo'),
    path('api/pong/start/', views.StartGameView.as_view(), name='start_game'),
    path('api/pong/move/', views.MovePlayerView.as_view(), name='move_player'),
    path('api/pong/stop/', views.StopGameView.as_view(), name='stop_game'),
    path('test/', views.TestView.as_view(), name='test_view'),
]