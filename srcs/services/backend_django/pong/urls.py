from django.urls import path
from . import views

urlpatterns = [
    path('pong/', views.pong_view, name='pong'),
    path('tournament/', views.tournament_view, name='tournament'),
    path('pongSolo/', views.pongSolo_view, name='pongSolo'),
]