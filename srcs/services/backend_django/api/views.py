# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password, check_password
from .forms import UserRegistrationForm, SettingsUpdateForm
from .models import User_site, Accessibility, Stats_user
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import json
import base64
import os
import requests
import time
from typing import Optional
from typing import Union


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

@csrf_exempt
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
@csrf_exempt
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
                    'avatar': avatar,}
            return JsonResponse(data, status=200)
        except Accessibility.DoesNotExist:
            return JsonResponse({'error': 'Settings not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
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
@csrf_exempt
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
@csrf_exempt
def updatePassword(request, nickname):
    if request.method == 'PUT':
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
@csrf_exempt
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
@csrf_exempt
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
    key: str = ""
    secret: str = ""
    token: str = ""
    expires_in: int = 0

    def __init__(self, key: str, secret: str):
        self.key = key
        self.secret = secret
        self.rate_limit_last_time = time.time()
        self.rate_limit_last_time_hours = time.time()
        if not self.get_token():
            print("Failed to get token")

    def get_token(self) -> bool:
        self.add_rate()
        try:
            r = requests.post(f"{self.intra}/oauth/token", data={
                "grant_type": "client_credentials",
                "client_id": self.key,
                "client_secret": self.secret
            })
        except Exception as e:
            return False
        if r.status_code == 200:
            self.token = r.json()["access_token"]
            self.expire_at = r.json()["expires_in"] + r.json()["created_at"]
            return True
        else:
            return False

    def get_access_token(self, token: str, state: str, domain: str) -> str:
        self.add_rate()
        r = None
        try:
            r = requests.post(f"{self.intra}/oauth/token", data={
                "grant_type": "authorization_code",
                "client_id": self.key,
                "client_secret": self.secret,
                "code": token,
                "state": state,
                "redirect_uri": domain
            })
        except Exception as e:
            print("DEBUG: ", e)
            return ""
        if r.status_code != 200:
            print("DEBUG: ", r.json())
            return ""
        print("Dbg: ", r.json())
        return r.json()["access_token"]

    def add_rate(self):
        if self.rate_limit_last_time == time.time() and self.rate_limit_sec == 2:
            time.sleep(1)
            self.rate_limit_sec = 0
        if self.rate_limit_last_time != time.time():
            self.rate_limit_sec = 0
            self.rate_limit_last_time = time.time()
        self.rate_limit_sec += 1

    def get(self, url: str, params: Optional[list] = None) -> tuple[dict, int, dict]:
        if params is None:
            params = []
        if self.expire_at < time.time():
            if not self.get_token():
                return {"error": "Rate limit"}, 429, {}
        self.add_rate()
        req_url = self.intra
        if "v2/" != url[:3]:
            req_url += '/v2'
        req_url += f"{url}?{'&'.join([item for item in params])}"
        r = None
        try:
            r = requests.get(req_url, headers={
                "Authorization": f"Bearer {self.token}"
            })
        except Exception as e:
            return {"error": e.__str__()}, 0, {}
        if r and r.status_code == 200:
            return r.json(), r.status_code, dict(r.headers)
        else:
            return {"error": r.text}, r.status_code, dict(r.headers)


def auth_42(request):
    Api_42 = Api(os.getenv('CLIENT_ID'), os.getenv('SECRET_KEY'))
    code = request.GET.get('code')
    state = request.GET.get('state')
    print("Code: ", code)
    final_token = Api_42.get_access_token(code, state, os.getenv('REDIRECT_URI'))
    print(final_token)
    if final_token:
        return JsonResponse({"access_token": final_token}, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)