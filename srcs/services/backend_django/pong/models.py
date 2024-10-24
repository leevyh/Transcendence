from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, User
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from api.models import User_site

# Dimensions du terrain de jeu
GAME_WIDTH = 640
GAME_HEIGHT = 480

# Vitesse de la balle
BALL_SPEED_X = 3
BALL_SPEED_Y = 3

class Game(models.Model):
    player_1 = models.ForeignKey(User_site, related_name='game_player_1', on_delete=models.CASCADE)
    player_2 = models.ForeignKey(User_site, related_name='game_player_2', blank=True, null=True, on_delete=models.CASCADE)
    player_1_score = models.IntegerField(default=0)
    player_2_score = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game betweem {self.player_1.username} and {self.player_2.username}"

class Tournament(models.Model):
    player_1 = models.ForeignKey(User_site, related_name='tournament_player_1', on_delete=models.CASCADE)
    player_2 = models.ForeignKey(User_site, related_name='tournament_player_2', on_delete=models.CASCADE)
    player_3 = models.ForeignKey(User_site, related_name='tournament_player_3', on_delete=models.CASCADE)
    player_4 = models.ForeignKey(User_site, related_name='tournament_player_4', on_delete=models.CASCADE)
    semi_finals1 = models.ForeignKey(Game, related_name='semi_finals1', blank=True, null=True, on_delete=models.CASCADE)
    semi_finals2 = models.ForeignKey(Game, related_name='semi_finals2', blank=True, null=True, on_delete=models.CASCADE)
    small_final = models.ForeignKey(Game, related_name='small_final', blank=True, null=True, on_delete=models.CASCADE)
    final = models.ForeignKey(Game, related_name='final', blank=True, null=True, on_delete=models.CASCADE)
    final_ranking = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tournament with {self.player_1.username}, {self.player_2.username}, {self.player_3.username}, {self.player_4.username}"