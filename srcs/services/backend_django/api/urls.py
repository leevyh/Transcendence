from django.urls import path
from . import views

urlpatterns = [
	# path('', views.index, name='index'),
	path('api/register/', views.register, name='register'),
]
