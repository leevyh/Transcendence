# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password, check_password
from .forms import UserRegistrationForm, SettingsUpdateForm
from .models import User_site, Settings_user, Stats_user
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
import json

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = UserRegistrationForm(data)
            if form.is_valid():
                user = form.save(commit=False)
                user.password = make_password(form.cleaned_data['password'])
                user.username = form.cleaned_data.get('username', None)
                user.save()
                settings = Settings_user(user=user)
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
                return JsonResponse({'message': 'User logged in successfully'}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except User_site.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required(login_url='/api/login')
@csrf_exempt
def	updateSettings(request, user_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            settings_id = Settings_user.objects.get(user=user_id)
            form = SettingsUpdateForm(data, instance=settings_id)
            if form.is_valid():
                update_settings = form.save(commit=False)
                update_settings.save()
                return JsonResponse({'message': 'Settings updated successfully'}, status=200)
            else:
                return JsonResponse({'errors': form.errors}, status=400)
        except:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_profile(request, nickname):
    if request.method == 'GET':
        try:
            user = User_site.objects.get(nickname=nickname)
            try:
                stats = Stats_user.objects.get(user=user)
                data = {'nickname': user.nickname,
                        'created_at': user.created_at,
                        'status': user.status,
                        'nb_games': stats.nb_games,
                        'nb_wins': stats.nb_wins,
                        'nb_losses': stats.nb_losses,
                        'win_rate': stats.win_rate,
                        'nb_point_taken' :stats.nb_point_taken,
                        'nb_point_given' :stats.nb_point_given}
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


