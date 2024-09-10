from django.http import JsonResponse
from api.models import User_site as User
from django.contrib.auth.decorators import login_required
from .models import Conversation

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

            if conversation:
                # Si la conversation existe, on retourne ses détails
                return JsonResponse({
                    'id': conversation.id,
                    'members': list(conversation.members.values('id', 'username')),
                    'created_at': conversation.created_at
                })
            else:
                # Si aucune conversation n'est trouvée, on crée une nouvelle conversation
                conversation = Conversation.objects.create()
                conversation.members.add(sender, receiver)
                conversation.save()
                return JsonResponse({
                    'id': conversation.id,
                    'members': list(conversation.members.values('id', 'username')),
                    'created_at': conversation.created_at
                })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)