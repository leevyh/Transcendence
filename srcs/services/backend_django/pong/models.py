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
    player_1 = models.ForeignKey(User_site, related_name='player_1', on_delete=models.CASCADE)
    player_2 = models.ForeignKey(User_site, related_name='player_2', blank=True, null=True, on_delete=models.CASCADE)
    player_1_score = models.IntegerField(default=0)
    player_2_score = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game betweem {self.player_1.username} and {self.player_2.username}"