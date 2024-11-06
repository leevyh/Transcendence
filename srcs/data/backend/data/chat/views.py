from django.http import JsonResponse
from api.models import User_site as User
from django.contrib.auth.decorators import login_required
from .models import Conversation

@login_required(login_url='/api/login')
def conversationID(request, id):
    if request.method == 'GET':
        try:
            # Get the sender from the request
            sender = request.user

            # Get the receiver by id
            try:
                receiver = User.objects.get(id=id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Search for an existing conversation between sender and receiver
            conversation = Conversation.objects.filter(members=sender).filter(members=receiver).first()

            # If a conversation exists, return its details
            if conversation:
                return JsonResponse({
                    'id': conversation.id,
                    'members': [{'id': member.id, 'nickname': member.nickname} for member in conversation.members.all()],
                    'created_at': conversation.created_at
                })
            # If no conversation exists, create a new one
            else:
                conversation = Conversation.objects.create()
                conversation.members.add(sender, receiver)
                conversation.save()

                return JsonResponse({
                    'id': conversation.id,
                    'members': [
                        {'id': member.id, 'nickname': member.nickname} for member in conversation.members.all()
                    ],
                    'created_at': conversation.created_at
                })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)