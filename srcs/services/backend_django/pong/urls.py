from django.urls import path
from . import views

urlpatterns = [
    # path('create/', views.create_game, name='create_game'),
    path('<str:game_id>/', views.game_view, name='game_view'),
]