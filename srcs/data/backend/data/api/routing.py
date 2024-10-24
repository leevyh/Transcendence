#Routing.py isdef getNotification(request):
    if request.method == 'GET':
        try:
            token_user = request.headers.get('Authorization').split(' ')[1]
            if (token_user == 'null'):
                return JsonResponse({'error': 'Invalid token'}, status=401)
            try:
                payload = jwt.decode(token_user, 'secret', algorithms=['HS256'])
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token expired'}, status=307)
            username = payload['username']
            #get the user, the user_id and the notifications and content of notifications inside the good table
            user = User_site.objects.get(username=username)
            user_id = user.id
            notifications = Notification.objects.filter(user=user_id)
            notifications_list = []
            #Table of notifications :
            # class Notification(models.Model):
            # user = models.ForeignKey(User_site, on_delete=models.CASCADE)
            # type = models.CharField(max_length=255)
            # status = models.CharField(max_length=255, default='unread', choices=[('unread', 'unread'), ('read', 'read')])
            # friend_request = models.ForeignKey(FriendRequest, on_delete=models.CASCADE, null=True)
            # # game_invite = models.ForeignKey(GameInvite, on_delete=models.CASCADE, null=True)
            # # tournament_invite = models.ForeignKey(TournamentInvite, on_delete=models.CASCADE, null=True)
            # created_at = models.DateTimeField(default=timezone.now)
            for notification in notifications:
                if notification.type == 'friend_request':
                    avatar = base64.b64encode(notification.friend_request.user.avatar.read()).decode('utf-8')
                    notifications_list.append({'type': notification.type,
                                'from_user': notification.friend_request.user.nickname,
                                'from_avatar': avatar,
                                'created_at': notification.created_at})

            return JsonResponse(notifications_list, status=200)
        except User_site.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

# from django.urls import re_path
# from . import consumers

# websocket_urlpatterns = [
#     re_path(r'ws/status/$', consumers.StatusConsumer.as_asgi()),
#     re_path(r'ws/friend_request/$', consumers.NotificationConsumer.as_asgi()),
# ] # A supprimer pour utiliser le routing de backend