from django.shortcuts import render

def pong_view(request):
    # Retourner une page de jeu Pong
    return render(request, 'index.html')