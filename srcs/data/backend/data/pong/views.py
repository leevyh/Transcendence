from django.shortcuts import render
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

# Vues d'API pour interagir avec le jeu via des requêtes HTTP
class StartGameView(APIView):
    async def post(self, request):
        #appeler pong_view ou Po
        return Response({"message": "Game started"}, status=status.HTTP_200_OK)
        return redirect('pong_view')

class MovePlayerView(APIView):
    async def post(self, request):
        player = request.data.get("player")
        move = request.data.get("move")

        # Appelle la méthode du consumer pour déplacer le joueur
        await PongConsumer.cli_move_player(player, move)

        return Response({"message": f"Player {player} moved {move}"}, status=status.HTTP_200_OK)

class StopGameView(APIView):
    async def post(self, request):
        # Appelle la méthode pour arrêter le jeu
        await PongConsumer.cli_stop_game()

        return Response({"message": "Game stopped"}, status=status.HTTP_200_OK)