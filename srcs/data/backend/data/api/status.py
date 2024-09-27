# status.py

import logging

from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def django_status(request):
    return JsonResponse({'status': 'ok'}, status=200)

@csrf_exempt
def logging_status(request):
    logger = logging.getLogger('django.server')
    logger.info('Log successfully send to logstash')
    return JsonResponse({'status': 'ok'}, status=200)