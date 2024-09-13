import uuid
from django.db import models

class Game(models.Model):
   
    player_1 = models.CharField(max_length=100)
    player_2 = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)  # Pour savoir si la partie est en cours
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game between {self.player1.username} and {self.player2.username}"
