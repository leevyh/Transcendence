from django.urls import path
from . import views

urlpatterns = [
	# path('', views.index, name='index'),
	path('api/register/', views.register, name='register'),
	path('api/updateSettings/<int:user_id>', views.updateSettings, name='updateSettings'),
]
