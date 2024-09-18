import { getCookie } from '../utils.js';
import { createUserCard, createChatWindow } from './chat_utils.js';

export function chatView(container) {
    container.innerHTML = '';

    // Création du WebSocket pour le statut des utilisateurs
    const statusSocket = new WebSocket('wss://' + window.location.host + '/wss/status/');

    // Onopen event
    statusSocket.onopen = function(event) {
        console.log('Status socket opened');          // DEBUG
    };

    // On message received from the server (status of a user)
    statusSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        // Mettre à jour ou créer la carte utilisateur avec les données reçues
        const userList = document.getElementById('user-list');
        createUserCard(data, userList);
    };

    // Onclose event
    statusSocket.onclose = function(event) {
        console.error('Status socket closed', event);         // DEBUG
    };

    // Création du conteneur principal (container-fluid)
    const containerFluid = document.createElement('div');
    containerFluid.className = 'container-fluid';

    // Création de la première rangée (row)
    const row = document.createElement('div');
    row.className = 'row';

    // Création de la première colonne (col-md-4)
    const col1 = document.createElement('div');
    col1.className = 'col-md-4';

    // CONNECTED USERS
    const h5 = document.createElement('h5');
    h5.textContent = 'Joueurs connectés';

    // Liste des joueurs connectés (ul)
    const userList = document.createElement('ul');
    userList.className = 'list-group';
    userList.id = 'user-list';

    col1.appendChild(h5);
    col1.appendChild(userList);
    row.appendChild(col1);

    const col2 = createChatWindow();
    row.appendChild(col2);

    containerFluid.appendChild(row);
    container.appendChild(containerFluid);

    // Appeler l'API pour récupérer tous les utilisateurs
    fetch('/api/users/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => response.json())
    .then(data => {
        // Pour chaque utilisateur, créer une carte
        data.forEach(user => {
            createUserCard(user, userList);
        });
    })
    .catch(error => console.error('Error:', error));
}