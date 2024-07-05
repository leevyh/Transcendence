from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.

# class UserSite(models.Model):
# 	id = models.AutoField(primary_key=True)
# 	email = models.CharField(max_length=255)
# 	password = models.CharField(max_length=255)
# 	nickname = models.CharField(max_length=255)
# 	create_at = models.DateTimeField(auto_now_add=True)
#
# 	class Meta:
# 		db_table = 'user_site'
# 		managed = False
#
# 	def __str__(self):
# 		return self.username