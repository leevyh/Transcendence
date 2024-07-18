# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password, check_password
from .forms import UserRegistrationForm, SettingsUpdateForm
from .models import User_site, Settings_user
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

