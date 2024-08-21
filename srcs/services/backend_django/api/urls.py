from django.urls import path
from . import views

urlpatterns = [
	# path('', views.index, name='index'),
	path('api/register/', views.register, name='register'),
	path('api/login/', views.loginView, name='login'),
	path('api/profile/<str:nickname>', views.get_profile, name='profile'),
	path('api/settings/<str:nickname>', views.get_settings, name='settings'),
	path('api/updateSettings/<str:nickname>', views.updateSettings, name='updateSettings'),
	path('api/updataPassword/<str:nickname>', views.updatePassword, name='updatePassword'),
	path('api/stats/<int:user_id>', views.get_Stats, name='stats'),
	path('api/updateStats/<int:user_id>', views.update_Stats, name='updateStats'),
	path('api/status_user/', views.get_status_all_users, name='status_user'),
	path('api/logout/', views.logoutView, name='logout'),
	path('api/auth/', views.auth_42, name='auth_42'),
]