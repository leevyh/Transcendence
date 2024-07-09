from django import forms
from .models import User_site

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User_site
        fields = ['email',
                  'login',
                  'password',
                  'nickname']

    def clean_password(self):
        password = self.cleaned_data.get('password')
        # Ajouter des validations supplémentaires ici si nécessaire
        return password