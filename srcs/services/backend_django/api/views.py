# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password
from .forms import UserRegistrationForm
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
				user.save()
				return JsonResponse({'message': 'User registered successfully'}, status=201)
			else:
				return JsonResponse({'errors': form.errors}, status=400)
		except json.JSONDecodeError:
			return JsonResponse({'error': 'Invalid JSON'}, status=400)
	else:
		return JsonResponse({'error': 'Invalid request method'}, status=405)

