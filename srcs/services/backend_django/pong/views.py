from django.shortcuts import render

def pong_view(request):
    # Retourner une page de jeu Pong
    return render(request, 'index.html')

def tournament_view(request):
    # Retourner une page de tournoi
    return render(request, 'index.html')

def pongSolo_view(request):
    # Retourner une page de jeu Pong en solo
    return render(request, 'index.html')