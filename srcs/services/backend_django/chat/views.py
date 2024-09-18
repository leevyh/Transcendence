from django.http import JsonResponse
from api.models import User_site as User
from django.contrib.auth.decorators import login_required
from .models import Conversation, UserBlock
import json

@login_required(login_url='/api/login')
def conversationID(request, nickname):
    if request.method == 'GET':
        try:
            # Get the sender from the request
            sender = request.user

            # Get the receiver by nickname
            try:
                receiver = User.objects.get(nickname=nickname)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Search for an existing conversation between sender and receiver
            conversation = Conversation.objects.filter(members=sender).filter(members=receiver).first()

            # If a conversation exists, return its details
            if conversation:

                return JsonResponse({
                    'id': conversation.id,
                    'members': [
                        {'id': member.id, 'nickname': member.nickname} for member in conversation.members.all()
                    ],
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


@login_required(login_url='/api/login')
def block_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            blocker = request.user

            # Get the user to block
            blocked = User.objects.get(nickname=data.get('blocked'))

            # Check if the UserBlock entry already exists
            if UserBlock.objects.filter(blocker=blocker, blocked=blocked).exists():
                return JsonResponse({'error': 'User already blocked'}, status=400)

            # Create a UserBlock entry
            UserBlock.objects.create(blocker=blocker, blocked=blocked)

            return JsonResponse({'message': 'User blocked successfully'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
        

@login_required(login_url='/api/login')
def unblock_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            blocker = request.user

            # Get the user to unblock
            blocked = User.objects.get(nickname=data.get('blocked'))

            # Check if the UserBlock entry exists
            if not UserBlock.objects.filter(blocker=blocker, blocked=blocked).exists():
                return JsonResponse({'error': 'User not blocked'}, status=400)

            # Remove the UserBlock entry
            UserBlock.objects.filter(blocker=blocker, blocked=blocked).delete()

            return JsonResponse({'message': 'User unblocked successfully'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)