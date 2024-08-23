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
import

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

# 
# def is_logged_in(request):
#     if request.method == 'GET':
#         user = User_site.objects.get()
#         data = {
#             'status': user.status
#         }
#         return JsonResponse(data, status=200)