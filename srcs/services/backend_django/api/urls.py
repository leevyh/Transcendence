from django.urls import path
from . import views

urlpatterns = [
	# path('', views.index, name='index'),
	path('api/register/', views.register, name='register'),
	path('api/login/', views.loginView, name='login'),
	path('api/updateSettings/<int:user_id>', views.updateSettings, name='updateSettings'),
	path('api/stats/<int:user_id>', views.get_Stats, name='stats'),
	path('api/updateStats/<int:user_id>', views.update_Stats, name='updateStats'),
]
