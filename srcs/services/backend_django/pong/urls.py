from django.urls import path
from . import views

urlpatterns = [
    path('pong/', views.pong_view, name='pong'),
]