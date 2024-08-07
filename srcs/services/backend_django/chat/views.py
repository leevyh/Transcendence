from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User_site, Message
from .serializers import MessageSerializer
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

# def index(request):
#     return render(request, "chat/index.html")

# def room(request, room_name):
#     return render(request, "chat/room.html", {"room_name": room_name})

# History of messages in a room
class MessageList(APIView):
    def get(self, request, username=None):
        try:
            if username:
                messages = Message.objects.filter(username=username)
            else:
                messages = Message.objects.all()
            serializer = MessageSerializer(messages, many=True)
            return Response({'success': True, 'data': serializer.data}, status=200) 
        except Exception as e:
            return Response({'error': str(e)}, status=200)
        
