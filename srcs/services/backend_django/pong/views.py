from django.shortcuts import render

def create_game(request):
    # Crée un identifiant de partie unique de 8 caractères
    game_id = uuid.uuid4().hex[:8]
    # Redirige l'utilisateur vers la partie avec cet ID
    return redirect(f'/pong/{game_id}/')

def game_view(request, game_id):
    # Passe le game_id au template pour l'utiliser dans le front-end
    return render(request, 'game.html', {'game_id': game_id})