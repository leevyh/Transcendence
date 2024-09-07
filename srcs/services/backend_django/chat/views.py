# from django.shortcuts import render
# from django.http import JsonResponse, HttpResponseBadRequest
# from django.contrib.auth.decorators import login_required
# from .models import Message
# # from django.contrib.auth.models import User
# from api.models import User_site as User

# @login_required
# def chat_view(request, username):
#     try:
#         user = User.objects.get(username=username)
#         messages = Message.objects.filter(
#             (models.Q(sender=request.user) & models.Q(receiver=user)) |
#             (models.Q(sender=user) & models.Q(receiver=request.user))
#         ).order_by('timestamp')
#         messages_data = [{"sender": msg.sender.username, "content": msg.content, "timestamp": msg.timestamp} for msg in messages]
#         return JsonResponse(messages_data, safe=False)
#     except User.DoesNotExist:
#         return HttpResponseBadRequest("Invalid user")

# @login_required
# def send_message(request):
#     if request.method == "POST":
#         receiver_username = request.POST.get('receiver')
#         content = request.POST.get('content')
#         try:
#             receiver = User.objects.get(username=receiver_username)
#             message = Message.objects.create(sender=request.user, receiver=receiver, content=content)
#             return JsonResponse({"status": "success", "message_id": message.id})
#         except User.DoesNotExist:
#             return HttpResponseBadRequest("Invalid receiver")
#     return HttpResponseBadRequest("Invalid request")


from django.http import JsonResponse
# from django.contrib.auth.models import User
from api.models import User_site as User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import Conversation, Message
from datetime import datetime, timedelta

# Recuperer les utilisateurs connectés
@login_required
def get_connected_users(request):
    users = User.objects.all().exclude(id=request.user.id)  # Exclure l'utilisateur actuel
    users_list = [{'id': user.id, 'username': user.username} for user in users]
    return JsonResponse(users_list, safe=False)

# Recuperer les conversations
@login_required
def get_messages(request, conversation_id):
    # Vérifier si la conversation existe
    if not Conversation.objects.filter(id=conversation_id).exists():
        return JsonResponse([], safe=False)
    else:
        # Récupérer la conversation et les messages associés
        conversation = Conversation.objects.get(id=conversation_id)
        messages = conversation.messages.all()

        messages_list = []
        now = datetime.now()

        for msg in messages:
            time_difference = now - msg.timestamp.replace(tzinfo=None)
            if time_difference < timedelta(hours=24):
                if time_difference < timedelta(minutes=60):
                    minutes_ago = int(time_difference.total_seconds() // 60)
                    formatted_date = f"{minutes_ago} mn ago"
                else:
                    hours_ago = int(time_difference.total_seconds() // 3600)
                    formatted_date = f"{hours_ago} h ago"
            else:
                formatted_date = msg.timestamp.strftime('%d-%m-%Y %H-%M')
            messages_list.append({
                'sender': msg.sender.nickname,
                'content': msg.content,
                'date': formatted_date 
            })
        return JsonResponse(messages_list, safe=False)

# Creer une conversation
@login_required
def start_conversation(request, user_id):
    other_user = User.objects.get(id=user_id)
    conversation, created = Conversation.objects.get_or_create(participants__in=[request.user, other_user])
    if not created:  # Si la conversation existe déjà, nous devons nous assurer qu'elle inclut les deux participants.
        if request.user not in conversation.participants.all():
            conversation.participants.add(request.user)
        if other_user not in conversation.participants.all():
            conversation.participants.add(other_user)
    # Exemple: si l'utilisateur connecté a l'ID 1 et l'autre utilisateur a l'ID 2, l'identifiant de la conversation sera 1-2
    # si l'utilisateur connecté a l'ID 2 et l'autre utilisateur a l'ID 1, l'identifiant de la conversation sera toujours 1-2
    conversation.id = f'{min(request.user.id, other_user.id)}{max(request.user.id, other_user.id)}'
    return JsonResponse({'conversation_id': conversation.id})


# Envoyer un message avec une date et heure, le nickname de l'utilisateur et le contenu du message
def send_message(request, conversation_id):
    if request.method == "POST":
        content = request.POST.get('content')
        conversation = Conversation.objects.get(id=conversation_id)

        # Crée le message et récupère l'instance du message créé
        message = Message.objects.create(conversation=conversation, sender=request.user, content=content)

        # Calculer la différence entre le timestamp du message et l'heure actuelle
        now = datetime.now()
        time_difference = now - message.timestamp.replace(tzinfo=None)

        if time_difference < timedelta(hours=24):
            if time_difference < timedelta(minutes=60):
                minutes_ago = int(time_difference.total_seconds() // 60)
                formatted_date = f"{minutes_ago} mn ago"
            else:
                hours_ago = int(time_difference.total_seconds() // 3600)
                formatted_date = f"{hours_ago} h ago"
        else:
            formatted_date = message.timestamp.strftime('%d-%m-%Y %H-%M')

        # Renvoie la réponse avec le message formaté
        return JsonResponse({
            'status': 'Message envoyé',
            'sender': request.user.nickname,
            'content': content,
            'date': formatted_date
        })

# Envoyer les informations de l'utilisateur connecté
@login_required
def current_user(request):
    if request.method == 'GET':
        user_data = {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
        }
        return JsonResponse(user_data)
    else:
        return JsonResponse({'error': 'Méthode de requête invalide'}, status=405)
