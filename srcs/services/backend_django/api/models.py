from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, User

class User_site(AbstractUser):
    ONLINE = "green"
    OFFLINE = "gray"
    INGAME = "yellow"
    STATUS = {
        ONLINE: "Online",
        OFFLINE: "Offline",
        INGAME: "In-Game",
    }
    login = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=255, default=OFFLINE, choices=STATUS) #check si ca marche



    def __str__(self):
        return self.login

class Settings_user(models.Model):
    FRENCH = "FR"
    ENGLISH = "EN"
    SPANISH = "SP"
    LANGUAGE = {
        FRENCH: "French",
        ENGLISH: "English",
        SPANISH: "Spanish",
    }
    user = models.OneToOneField(User_site, on_delete=models.CASCADE, primary_key=True)
    language = models.CharField(max_length=255, default=ENGLISH, choices=LANGUAGE)
    accessibility = models.BooleanField(default=False)
    dark_mode = models.BooleanField(default=False)
#
# class Cookie_user(models.Model):
#     user = models.OneToOneField(User_site, on_delete=models.CASCADE, primary_key=True)
#     cookie = models.CharField(max_length=255)
#     created_at = models.DateTimeField(default=timezone.now)
#     #end at one day after created_at
#     end_at = models.DateTimeField(default=timezone.now)








































# class User_site(models.Model):
#     ONLINE = "green"
#     OFFLINE = "gray"
#     INGAME = "yellow"
#     STATUS = {
#         ONLINE: "Online",
#         OFFLINE: "Offline",
#         INGAME: "In-Game",
#     }
#     email  = models.EmailField(max_length=255, unique=True)
#     login = models.CharField(max_length=255, unique=True)
#     password = models.CharField(max_length=128)
#     nickname = models.CharField(max_length=255)
#     status = models.CharField(max_length=255, default=OFFLINE, choices=STATUS) #check si ca marche
#     created_at = models.DateTimeField(default=timezone.now)


    # ONLINE = "green"
    # OFFLINE = "gray"
    # INGAME = "yellow"
    # STATUS = {
    #     ONLINE: "Online",
    #     OFFLINE: "Offline",
    #     INGAME: "In-Game",
    # }
    # email  = models.EmailField(max_length=255, unique=True)
    # login = models.CharField(max_length=255, unique=True)
    # password = models.CharField(max_length=128)
    # nickname = models.CharField(max_length=255)
    # status = models.CharField(max_length=255, default=OFFLINE, choices=STATUS) #check si ca marche
    # created_at = models.DateTimeField(default=timezone.now)





