from django import forms
from .models import User_site, Accessibility, Stats_user

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User_site
        fields = ['email',
                  'nickname',
                  'password',
                  'username',]

    def clean_password(self):
        password = self.cleaned_data.get('password')
        # Ajouter des validations supplémentaires ici si nécessaire
        return password


class AccessibilityUpdateForm(forms.ModelForm):
    class Meta:
        model = Accessibility
        fields = ['language',
                  'font_size',
                  'dark_mode']

class SettingsForm(forms.ModelForm):
    class Meta:
        model = User_site
        fields = ['email',
                  'nickname',]

# class NewGameForm(forms.ModelForm):
#     class Meta:
#         model = Stats_user
#         fields = ['nb_point_taken',
#                  'nb_point_given']
