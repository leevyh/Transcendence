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
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def tournament_view(request):
    # Retourner une page de tournoi
    return render(request, 'index.html')

def pongSolo_view(request):
    # Retourner une page de jeu Pong en solo
    return render(request, 'index.html')

class StartGameView(APIView):
    def post(self, request):
        # Logique pour démarrer le jeu
        return Response({"message": "Game started"}, status=status.HTTP_200_OK)

class MovePlayerView(APIView):
    def post(self, request):
        # Logique pour déplacer un joueur
        return Response({"message": "Player moved"}, status=status.HTTP_200_OK)

class StopGameView(APIView):
    def post(self, request):
        # Logique pour arrêter le jeu
        return Response({"message": "Game stopped"}, status=status.HTTP_200_OK)

# class TestView(APIView):
#     def get(self, request):
#         return Response({"message": "Test endpoint working!"}, status=status.HTTP_200_OK)
        
#     def post(self, request):
#         return Response({"message": "Post request received!"}, status=status.HTTP_200_OK)