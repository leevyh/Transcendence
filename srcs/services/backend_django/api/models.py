from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, User
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer

class User_site(AbstractUser):
    class Status(models.TextChoices):
        ONLINE = "online"
        OFFLINE = "offline"
        INGAME = "ingame"

    nickname = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=255, default=Status.OFFLINE, choices=Status.choices)
    avatar = models.ImageField(upload_to='avatar/', default='default.jpg')

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        super(User_site, self).save(*args, **kwargs)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "status_updates",
            {
                "type": "send_status_update",
                "message": {
                    "user_id": self.id,  # Ajoutez l'ID de l'utilisateur
                    "nickname": self.nickname,
                    "status": self.status,
                },
            },
        )

class Accessibility(models.Model):
    class Language(models.TextChoices):
        FRENCH = "fr"
        ENGLISH = "en"
        SPANISH = "sp"
    user = models.OneToOneField(User_site, on_delete=models.CASCADE, primary_key=True)
    language = models.CharField(max_length=255, default=Language.ENGLISH, choices=Language.choices)
    font_size = models.IntegerField(default=2, choices=[(1, 'Small'), (2, 'Medium'), (3, 'Large')])
    dark_mode = models.BooleanField(default=False)


class Stats_user(models.Model):
    user = models.OneToOneField(User_site, on_delete=models.CASCADE, primary_key=True)
    nb_games = models.IntegerField(default=0)
    nb_wins = models.IntegerField(default=0)
    nb_losses = models.IntegerField(default=0)
    nb_point_taken = models.IntegerField(default=0)
    nb_point_given = models.IntegerField(default=0)
    win_rate = models.FloatField(default=0.0)

class Notifications(models.Model):
    TYPE = (
        ('friend_request', 'friend_request'),
        ('game_invite', 'game_invite'),
        ('tournament_invite', 'tournament_invite'),
    )

    user = models.ForeignKey(User_site, on_delete=models.CASCADE)
    type = models.CharField(max_length=255, choices=TYPE)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)

class FriendRequest(models.Model):
    STATUS = (
        ('pending', 'pending'),
        ('accepted', 'accepted'),
        ('refused', 'refused'),
    )

    user = models.ForeignKey(User_site, on_delete=models.CASCADE, related_name='user')
    friend = models.ForeignKey(User_site, on_delete=models.CASCADE, related_name='friend')
    status = models.CharField(max_length=255, default='pending', choices=STATUS)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        super(FriendRequest, self).save(*args, **kwargs)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "friend_requests",
            {
                "type": "send_friend_request",
                "message": {
                    "user_id": self.user.id,
                    "friend_id": self.friend.id,
                    "nickname": self.user.nickname,
                },
            },
        )

class Friendship(models.Model):
    user1 = models.ForeignKey(User_site, related_name='friendships_initiated', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User_site, related_name='friendships_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = (('user1', 'user2'), ('user2', 'user1'))
        constraints = [
            models.UniqueConstraint(fields=['user1', 'user2'], name='unique_friendship'),
            models.UniqueConstraint(fields=['user2', 'user1'], name='inverse_unique_friendship')
        ]

    def __str__(self):
        return f"Friendship between {self.user1} and {self.user2}"


class MatchHistory(models.Model):

    class Result(models.TextChoices):
        WIN = "win"
        LOSS = "loss"

    player1 = models.ForeignKey(User_site, on_delete=models.CASCADE, related_name='player1')
    opponent = models.ForeignKey(User_site, on_delete=models.CASCADE, related_name='player2')
    result = models.CharField(max_length=255, choices=Result.choices)
    player_1_score = models.IntegerField()
    player_2_score = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)

# class PrivateGameInvite(model.Model):


# class TournamentInvite(model.Model):





