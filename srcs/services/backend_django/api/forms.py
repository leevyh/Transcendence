from django import forms
from .models import User_site, Settings_user, Stats_user

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    # confirm_password = forms.CharField(widget=forms.PasswordInput, label='Confirm Password')

    class Meta:
        model = User_site
        fields = ['email',
                  'nickname',
                  'password',
                #   'confirm_password',
                  'username',]

    def clean_password(self):
        password = self.cleaned_data.get('password')
        # Ajouter des validations supplémentaires ici si nécessaire
        return password


class SettingsUpdateForm(forms.ModelForm):
    class Meta:
        model = Settings_user
        fields = ['language',
                  'accessibility',
                  'dark_mode']

# class NewGameForm(forms.ModelForm):
#     class Meta:
#         model = Stats_user
#         fields = ['nb_point_taken',
#                  'nb_point_given']
