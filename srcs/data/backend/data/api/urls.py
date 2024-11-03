from django.urls import path
from . import views
from . import status

urlpatterns = [
	# path('', views.index, name='index'),
	path('register/', views.register, name='register'),
	path('login/', views.loginView, name='login'),
	path('match_history/<int:id>/', views.get_match_history, name='match_history'),
	path('stats/<int:id>/', views.get_stats, name='stats'),
	path('settings/', views.get_settings, name='settings'),
	path('game_settings/', views.get_game_setting, name='game_settings'),
	path('updateSettings/', views.updateSettings, name='updateSettings'),
	path('updateAvatar/', views.updateAvatar, name='updateAvatar'),
	path('updateGameSettings/', views.updateGameSettings, name ='updateGameSettings'),
	path('deleteAvatar/', views.deleteAvatar, name='deleteAvatar'),
	path('updateAccessibility/', views.updateAccessibility, name='updateAccessibility'),
	path('updatePassword/', views.updatePassword, name='updatePassword'),
	path('updateStats/', views.update_Stats, name='updateStats'),
	# path('status_user/', views.get_status_all_users, name='status_user'), # Unused
	path('users/', views.all_users, name='users'),
	path('current_user/', views.who_am_i, name='current_user'),
	path('logout/', views.logoutView, name='logout'),
	path('check_auth/', views.check_auth, name='check_auth'),
	path('auth/', views.auth_42, name='auth'),
	path('token/', views.token_42, name='token'),
	path('get_friend_request/<str:nickname>/', views.get_friend_request, name='get_friend_request'),
	path('notifications/unread/', views.get_notificationUnread, name='get_notifications_unread'),
	path('notifications/', views.get_Notification, name='get_Notification'),
	path('notifications/read', views.read_All_Notification, name='read_All_Notifications'),
	path('notification/read_notification/<int:id>/', views.read_Notification, name='read_Notification'),
	path('notification/delete_notification/<int:id>/', views.delete_Notification, name='delete_Notification'),
	# path('request_friend/', views.send_notification, name='friends'),
	# path('game_invite/', views.send_notification, name='game_invite'),
	# path('notifications/', views.get_notifications, name='get_notifications'),
	path('django_status/', status.django_status, name='django_status'),
	path('logging_status/', status.logging_status, name='logging_status'),
]