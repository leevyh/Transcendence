# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password, check_password
from .forms import UserRegistrationForm, SettingsUpdateForm
from .models import User_site, Accessibility, Stats_user
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from typing import Optional
from typing import Union
from django.http import HttpResponse as HTTPResponse
import json
import base64
import os
import requests
import time

def check_auth(request):
    if request.user.is_authenticated:
        value = True
        return JsonResponse({'value': value}, status=200)
    else:
        value = False
        return JsonResponse({'value': value}, status=200)

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = UserRegistrationForm(data)
            if form.is_valid():
                user = form.save(commit=False)
                user.set_password(form.cleaned_data['password'])  # Utilisez set_password pour le mot de passe
                # user.password = make_password(form.cleaned_data['password'])
                user.username = form.cleaned_data.get('username', None)
                user.save()
                settings = Accessibility(user=user)
                settings.save()
                stats = Stats_user(user=user)
                stats.save()
                return JsonResponse({'message': 'User registered successfully'}, status=201)
            else:
                return JsonResponse({'errors': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def loginView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = authenticate(request, username=data['login'], password=data['password'])
            if user is not None:
                login(request, user)
                user.status = User_site.Status.ONLINE
                user.save()
                return JsonResponse({'message': 'User logged in successfully'}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except User_site.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_profile(request, nickname):
    if request.method == 'GET':
        try:
            user = User_site.objects.get(nickname=nickname)
            try:
                stats = Stats_user.objects.get(user=user)
                avatar_image = user.avatar
                avatar = base64.b64encode(avatar_image.read()).decode('utf-8')
                data = {'nickname': user.nickname,
                        'email': user.email,
                        'created_at': user.created_at,
                        'status': user.status,
                        'nb_games': stats.nb_games,
                        'nb_wins': stats.nb_wins,
                        'nb_losses': stats.nb_losses,
                        'win_rate': stats.win_rate,
                        'nb_point_taken' :stats.nb_point_taken,
                        'nb_point_given' :stats.nb_point_given,
                        'avatar': avatar,
                        }
                return JsonResponse(data, status=200)
            except Stats_user.DoesNotExist:
                return JsonResponse({'error': 'Stats not found'}, status=404)
        except User_site.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_Stats(request, user_id):
    if request.method == 'GET':
        try:
            stats = Stats_user.objects.get(user=user_id)
            return JsonResponse({'nb_games': stats.nb_games,
                                 'nb_wins': stats.nb_wins,
                                 'nb_losses': stats.nb_losses,
                                 'win_rate': stats.win_rate,
                                 'nb_point_taken' :stats.nb_point_taken,
                                 'nb_point_given' :stats.nb_point_given}, status=200)
        except Stats_user.DoesNotExist:
            return JsonResponse({'error': 'Stats not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required(login_url='/api/login')
def get_settings(request, nickname):
    if request.method == 'GET':
        try:
            user = User_site.objects.get(nickname=nickname)
            user_id = user.id
            settings = Accessibility.objects.get(user=user_id)
            avatar_image = user.avatar
            avatar = base64.b64encode(avatar_image.read()).decode('utf-8')
            data = {'nickname': user.nickname,
                    'email': user.email,
                    'language': settings.language,
                    'accessibility': settings.accessibility,
                    'dark_mode': settings.dark_mode,
                    'avatar': avatar}
            return JsonResponse(data, status=200)
        except Accessibility.DoesNotExist:
            return JsonResponse({'error': 'Settings not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_status_all_users(request):
    if request.method == 'GET':
        users = User_site.objects.all()
        data = []
        for user in users:
            data.append({'nickname': user.nickname,
                         'status': user.status})
            print(data)
        return JsonResponse(data, status=200, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required(login_url='/api/login')

def updateSettings(request, nickname):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            print(data)

            return JsonResponse({'message': 'Settings updated successfully'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required(login_url='/api/login')

def updatePassword(request, nickname):
    if request.method == 'PUT':
        print(nickname)
        try:
            data = json.loads(request.body)
            user = User_site.objects.get(nickname=nickname)
            if check_password(data['old_password'], user.password):
                user.set_password(data['new_password'])
                user.save()
                return JsonResponse({'message': 'Password updated successfully'}, status=200)
            else:
                return JsonResponse({'error': 'Invalid password'}, status=401)
        except User_site.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@login_required(login_url='/api/login') # TODO CHANGE THIS ROUTE TO GO

def update_Stats(request, user_id): #TODO without form and with json.loads. Need to changed if we use a view in python or views in js
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            stats_id = Stats_user.objects.get(user=user_id)
            nb_wins = stats_id.nb_wins
            nb_losses = stats_id.nb_losses
            if data['result'] == 'win':
                nb_wins += 1
            else:
                nb_losses += 1
            nb_games = stats_id.nb_games
            nb_games += 1
            nb_point_taken = stats_id.nb_point_taken
            nb_point_taken += data['nb_point_taken']
            nb_point_given = stats_id.nb_point_given
            nb_point_given += data['nb_point_given']
            win_rate = nb_wins / nb_games * 100.00
            stats_id.nb_games = nb_games
            stats_id.nb_wins = nb_wins
            stats_id.nb_losses = nb_losses
            stats_id.nb_point_taken = nb_point_taken
            stats_id.nb_point_given = nb_point_given
            stats_id.win_rate = win_rate
            stats_id.save()
            return JsonResponse({'message': 'Stats updated successfully'}, status=200)
        except Stats_user.DoesNotExist:

            return JsonResponse({'error': 'Stats not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required(login_url='/api/login')

def logoutView(request):
    if request.method == 'POST':
        status = User_site.Status.OFFLINE
        user = User_site.objects.get(id=request.user.id)
        user.status = status
        user.save()
        logout(request)
        return JsonResponse({'message': 'User logged out successfully'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

# @csrf_exempt
# def auth_42(request):
#     #Authorization code flow
#     if request.method == 'GET':
#         client_id = os.getenv('CLIENT_ID')
#         client_secret = os.getenv('CLIENT_SECRET')
#         redirect_uri = os.getenv('REDIRECT_URI')
#         url = "https://api.intra.42.fr/oauth/authorize"
#         request = request.post(url, data={"grant_type": "client_credentials",
#                                             "client_id": client_id,
#                                             "client_secret": client_secret})
#         if request.status_code == 200:
#             token = request.json()['access_token']
#             expires_in = request.json()['expires_in'] + request.json()['created_at']
#             print(token)
#             print(expires_in)
#         else:
#             return JsonResponse({'error': 'Invalid request'}, status=400)
#
#         return JsonResponse({'message': 'Authorization successful'}, status=200)
#
#         #print all attributes of response
#         print(dir(response))
#         print(response.url)
#         print(response.status_code)
#         print(response.text)
#         print(response.headers)
#         print(response.json)
#         #Send Url to front and redirect front to this url
#         response_data = {'url': response.url,
#                          'code': response.status_code}
#         return JsonResponse(response_data, status=200)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)

class Api:
    intra: str = "https://api.intra.42.fr"
    client_id: str = ""
    client_secret: str = ""
    code_authorize: str = ""
    redirect_uri: str = ""


    def __init__(self, client_id: str, client_secret: str, redirect_uri: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri

    def get_code_authorize(self):
        url = f"{self.intra}/oauth/authorize?client_id={self.client_id}&redirect_uri={self.redirect_uri}&response_type=code"
        return url


def auth_42(request):
    if request.method == 'GET':
        client_id = os.getenv('CLIENT_ID')
        client_secret = os.getenv('CLIENT_SECRET')
        redirect_uri = os.getenv('REDIRECT_URI')
        api = Api(client_id, client_secret, redirect_uri)
        url = api.get_code_authorize()
        return JsonResponse({'url': url}, status=200)

def check_user42(login):
    try:
        user = User_site.objects.get(nickname=login)
        return True
    except User_site.DoesNotExist:
        return False

def create_user42(response):
    data = response.json()
    access_token = data['access_token']
    expires_in = data['expires_in'] + data['created_at']
    url = "https://api.intra.42.fr/v2/me"
    headers = {
        'Authorization': f"Bearer {access_token}"
    }
    r = requests.get(url, headers=headers)
    if r.status_code == 200:
        data = r.json()
        #save data json in media directory
        with open('data.json', 'w') as f:
            json.dump(data, f, indent=4)
        username = data['login']
        email = data['email']
        nickname = data['login']
        # {
        #     "id": 116104,
        #     "email": "amugnier@student.42.fr",
        #     "login": "amugnier",
        #     "first_name": "Antoine",
        #     "last_name": "Mugnier",
        #     "usual_full_name": "Antoine Mugnier",
        #     "usual_first_name": null,
        #     "url": "https://api.intra.42.fr/v2/users/amugnier",
        #     "phone": "hidden",
        #     "displayname": "Antoine Mugnier",
        #     "kind": "student",
        #     "image": {
        #         "link": "https://cdn.intra.42.fr/users/aa2b6da5486c306e3ee6aa7dfb36c9b5/amugnier.jpg",
        #         "versions": {
        #             "large": "https://cdn.intra.42.fr/users/e37fda39ed56b223d59fe33a8ff16731/large_amugnier.jpg",
        #             "medium": "https://cdn.intra.42.fr/users/21a9dd75b2389c6df367b2bafea71eef/medium_amugnier.jpg",
        #             "small": "https://cdn.intra.42.fr/users/6194af12c14394528629684e5f1e823f/small_amugnier.jpg",
        #             "micro": "https://cdn.intra.42.fr/users/e755da2d51ab74a770e91a84dcaaf689/micro_amugnier.jpg"
        #         }
        #     }
        # }
        url = data['image']['versions']['medium']
        #download image in media directory
        r = requests.get(url)
        with open(f'media/{username}.jpg', 'wb') as f:
            f.write(r.content)
        avatar = f'media/{username}.jpg' #TODO change this to the path of the image
        if not check_user42(username):
            user = User_site(username=username, email=email, nickname=nickname, avatar=avatar)
            user.save()
            settings = Accessibility(user=user)
            settings.save()
            stats = Stats_user(user=user)
            stats.save()
        user = User_site.objects.get(nickname=nickname)
        user.status = User_site.Status.ONLINE
        user.save()
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def token_42(request):
    if request.method == 'POST':
        client_id = os.getenv('CLIENT_ID')
        client_secret = os.getenv('CLIENT_SECRET')
        redirect_uri = os.getenv('REDIRECT_URI')
        data = json.loads(request.body)
        code = data['code']
        print(f"code: {code}")
        print(f"client_id: {client_id}")
        print(f"client_secret: {client_secret}")
        url = f"https://api.intra.42.fr/oauth/token?client_id={client_id}&client_secret={client_secret}&code={code}&redirect_uri={redirect_uri}&grant_type=authorization_code"
        r = requests.post(url)
        if r.status_code == 200:
            create_user42(r)
            return JsonResponse({'message': 'Token created successfully'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid request'}, status=400)
