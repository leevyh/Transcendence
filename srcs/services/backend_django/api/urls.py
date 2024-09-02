from django.urls import path
from . import views

urlpatterns = [
	# path('', views.index, name='index'),
	path('register/', views.register, name='register'),
	path('login/', views.loginView, name='login'),
	path('profile/<str:nickname>', views.get_profile, name='profile'),
	path('settings/', views.get_settings, name='settings'),
	path('updateSettings/', views.updateSettings, name='updateSettings'),
	path('updateAvatar/', views.updateAvatar, name='updateAvatar'),
	path('updateAccessibility/', views.updateAccessibility, name='updateAccessibility'),
	path('updatePassword/', views.updatePassword, name='updatePassword'),
	path('get_accessibility/', views.get_accessibility, name='get_accessibility'),
	path('stats/', views.get_Stats, name='stats'),
	path('updateStats/', views.update_Stats, name='updateStats'),
	path('status_user/', views.get_status_all_users, name='status_user'),
	path('logout/', views.logoutView, name='logout'),
	path('check_auth/', views.check_auth, name='check_auth'),
	path('auth/', views.auth_42, name='auth'),
	path('token/', views.token_42, name='token'),
]
