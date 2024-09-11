from django.http import JsonResponse
from api.models import User_site as User
from django.contrib.auth.decorators import login_required
from .models import Conversation
import base64

@login_required(login_url='/api/login')
def conversationID(request, nickname):
    if request.method == 'GET':
        try:
            # Récupérer l'utilisateur effectuant la requête
            sender = request.user

            # Récupérer l'utilisateur avec le nickname
            try:
                receiver = User.objects.get(username=nickname)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Rechercher une conversation où les deux utilisateurs sont membres
            conversation = Conversation.objects.filter(members=sender).filter(members=receiver).first()

            def encode_avatar(user):
                # Convertir l'avatar de l'utilisateur en base64
                if user.avatar:  # Vérifier que l'utilisateur a un avatar
                    avatar_image = user.avatar.open()
                    avatar_base64 = base64.b64encode(avatar_image.read()).decode('utf-8')
                    avatar_image.close()
                    return avatar_base64
                return None

            if conversation:
                sender_avatar_base64 = encode_avatar(sender)
                receiver_avatar_base64 = encode_avatar(receiver)

                return JsonResponse({
                    'id': conversation.id,
                    'members': [
                        {'id': sender.id, 'username': sender.username, 'avatar': sender_avatar_base64},
                        {'id': receiver.id, 'username': receiver.username, 'avatar': receiver_avatar_base64},
                    ],
                    'created_at': conversation.created_at
                })
            else:
                # Si aucune conversation n'est trouvée, on crée une nouvelle conversation
                conversation = Conversation.objects.create()
                conversation.members.add(sender, receiver)
                conversation.save()

                sender_avatar_base64 = encode_avatar(sender)
                receiver_avatar_base64 = encode_avatar(receiver)

                return JsonResponse({
                    'id': conversation.id,
                    'members': [
                        {'id': sender.id, 'username': sender.username, 'avatar': sender_avatar_base64},
                        {'id': receiver.id, 'username': receiver.username, 'avatar': receiver_avatar_base64},
                    ],
                    'created_at': conversation.created_at
                })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)