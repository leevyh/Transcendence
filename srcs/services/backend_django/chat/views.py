from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from chat.models import Room

@csrf_exempt
def room_view(request):
    if request.method == 'POST':
        room_name = request.POST.get('room_name')
        chat_room, created = Room.objects.get_or_create(name=room_name)
        return JsonResponse({'room': chat_room.name, 'created': created})
    return JsonResponse({'error': 'Invalid request'}, status=400)
