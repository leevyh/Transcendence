from django.db import models
from django.utils import timezone

class User_site(models.Model):

    email  = models.EmailField(max_length=255, unique=True)
    login = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=128)
    nickname = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.login
