from django.db import models
from api.models import User_site

class Message(models.Model):
	user_id = models.OneToOneField(User_site, on_delete=models.CASCADE, primary_key=True)
	message = models.TextField()
	date = models.DateTimeField(auto_now_add=True)