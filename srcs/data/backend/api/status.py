# status.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def django_status(request):
    return JsonResponse({'status': 'ok'}, status=200)