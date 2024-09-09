import { getCookie } from '../utils.js';

// Fonction pour créer la carte utilisateur
function createUserCard(user, userList) {
    let userCard = document.getElementById(user.nickname);

    // Si la carte utilisateur n'existe pas, on la crée
    if (!userCard) {
        userCard = document.createElement('div');
        userCard.className = 'card';
        userCard.style = 'width: 50%;';
        userCard.id = user.nickname; // ID = nickname

        const userCardBody = document.createElement('div');
        userCardBody.className = 'card-body user-connected';

        const userNickname = document.createElement('h5');
        userNickname.className = 'card-title';
        userNickname.textContent = user.nickname;

        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.style = 'width: 10px; height: 10px; border-radius: 50%; margin-right: 5px;';
        userCardBody.appendChild(dot);
        userCardBody.appendChild(userNickname);
        userCard.appendChild(userCardBody);

        // Ajout de l'event listener pour ouvrir le chat
        // userCard.addEventListener('click', () => {
        //     openChat(user.user_id, user.nickname);  // Assurez-vous que user contient l'id de l'utilisateur
        // });

        // Ajouter la carte utilisateur à la liste
        userList.appendChild(userCard);
    }

    // Mettre à jour la couleur du point en fonction du statut
    const dot = userCard.querySelector('.dot');
    if (user.status === 'online') {
        dot.style.backgroundColor = 'green';
    } else {
        dot.style.backgroundColor = 'red';
    }

    // Si l'utilisateur est "offline", on supprime la carte
    if (user.status === 'offline') {
        userCard.remove();
    }
}

// Fonction principale
export function chatView(container) {
    container.innerHTML = '';

    // Création du WebSocket pour le statut des utilisateurs
    const statusSocket = new WebSocket('ws://localhost:8888/ws/status/');

    // Onopen event
    statusSocket.onopen = function(event) {
        console.log('Status socket opened');
    };

    // On message received from the server (status of a user)
    statusSocket.onmessage = function(event) {
        console.log('Message reçu:', event.data);  // DEBUG
        const data = JSON.parse(event.data);

        // Mettre à jour ou créer la carte utilisateur avec les données reçues
        const userList = document.getElementById('user-list');
        createUserCard(data, userList);
    };

    // Onclose event
    statusSocket.onclose = function(event) {
        console.error('Status socket closed', event);
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


// CHAT
    // Création de la deuxième colonne (col-md-8)
    const col2 = document.createElement('div');
    col2.className = 'col-md-8';

    // Création de la carte (card)
    const card = document.createElement('div');
    card.className = 'card';

    // Création de l'en-tête de la carte (card-header)
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.id = 'chat-header';
    cardHeader.textContent = 'Sélectionnez un joueur pour discuter';

    // Création du corps de la carte (card-body)
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.id = 'chat-body';
    cardBody.style.height = '400px';
    cardBody.style.overflowY = 'scroll';

    // Création du pied de carte (card-footer)
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    // Création de l'input group pour le message
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    // Champ de texte pour écrire un message
    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.id = 'chat-input';
    chatInput.className = 'form-control';
    chatInput.placeholder = 'Écrire un message...';

    // Bouton d'envoi
    const sendButton = document.createElement('button');
    sendButton.className = 'btn btn-primary';
    sendButton.id = 'send-message';
    sendButton.textContent = 'Envoyer';

    // Ajout du champ texte et du bouton dans l'input group
    inputGroup.appendChild(chatInput);
    inputGroup.appendChild(sendButton);

    // Ajout de l'input group dans le pied de carte
    cardFooter.appendChild(inputGroup);

    // Ajout de l'en-tête, du corps et du pied dans la carte
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    // Ajout de la carte dans la deuxième colonne
    col2.appendChild(card);

    // Ajout des deux colonnes dans la rangée
    row.appendChild(col1);
    row.appendChild(col2);

    // Ajout de la rangée dans le conteneur principal
    containerFluid.appendChild(row);

    // Enfin, ajout de tout le conteneur fluid dans l'élément container
    container.appendChild(containerFluid);


}
    