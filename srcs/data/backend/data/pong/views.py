from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pong.classGame import PongGame  # Assurez-vous d'importer la classe appropriée
import asyncio

# Vues pour rendre les pages HTML
def pong_view(request):
    # Retourner une page de jeu Pong
    return render(request, 'index.html')

def tournament_view(request):
    # Retourner une page de tournoi
    return render(request, 'index.html')

def pongSolo_view(request):
    # Retourner une page de jeu Pong en solo
    return render(request, 'index.html')