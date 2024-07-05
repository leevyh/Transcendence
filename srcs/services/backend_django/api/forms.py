# from django import forms
# from django.contrib.auth.models import User
# from .models import User
# import pbkdf2
#
# class UserForm(User):
# 	email = forms.CharField(max_length=100)
# 	password = forms.CharField(widget=forms.PasswordInput)
# 	nickname = forms.CharField(max_length=100)
# 	create_at = forms.DateTimeField()
#
# 	class Meta:
# 		model = User
# 		fields = ['email', 'password', 'nickname', 'create_at']