import { getCookie } from '../utils.js';

let conversationData = {};
let ws = null;

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
        userCard.addEventListener('click', () => {
            openChat(user.nickname);
        });

        // Ajouter la carte utilisateur à la liste
        userList.appendChild(userCard);
    }

    // Mettre à jour la couleur du point en fonction du statut
    const dot = userCard.querySelector('.dot');
    if (user.status === 'online') {
        dot.style.backgroundColor = 'green';
    } else if (user.status === 'offline') {
        userCard.remove();
        // dot.style.backgroundColor = 'red';
    } else if (user.status === 'in game') {
        dot.style.backgroundColor = 'orange';
    }
}

// Fonction pour créer la fenêtre de chat
function createChatWindow() {
    // Création de la deuxième colonne (col-md-8)
    const col2 = document.createElement('div');
    col2.className = 'col-md-8';
    col2.style.display = 'none'; // Masqué par défaut

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
    // A n'afficher que si le user a cliqué sur un autre user
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    // inputGroup.style.display = 'none'; // Masqué par défaut

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
    sendButton.addEventListener('click', () => {
        const message = chatInput.value;
        handleMessages(message);
    });

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

    return col2;
}

// Fonction pour gérer les messages
function handleMessages(message) {
    const chatHeader = document.getElementById('chat-header');
    const receiver = chatHeader.textContent.split(' ')[2];

    if (ws && ws.readyState === WebSocket.OPEN) {
        // Créer l'objet message à envoyer
        const messageData = {
            type: 'chat_message',
            message: message,
            sender: conversationData.members[0].username === receiver ? conversationData.members[1].username : conversationData.members[0].username,
            timestamp: new Date().toISOString()
        };

        // Envoyer le message via WebSocket
        ws.send(JSON.stringify(messageData)); 

        // Ajouter le message à l'interface utilisateur
        displayMessage(messageData);
        // Effacer le champ de texte
        document.getElementById('chat-input').value = '';
    } else {
        console.error('WebSocket is not open.');
    }
}

// Fonction pour afficher les messages
function displayMessage(messageData) {
    const chatBody = document.getElementById('chat-body');

    // Création d'un nouvel élément pour le message
    const messageElement = document.createElement('div');
    messageElement.className = messageData.sender === localStorage.getItem('nickname') ? 'sent-message' : 'received-message';

    // Formater le message avec le contenu et le timestamp
    messageElement.innerHTML = `
        <strong>${messageData.sender}:</strong> ${messageData.message} <br>
        <small>${new Date(messageData.timestamp).toLocaleTimeString()}</small>
    `;

    // Ajouter le message dans la fenêtre de chat
    chatBody.appendChild(messageElement);

    // Faire défiler la fenêtre de chat vers le bas pour voir le dernier message
    chatBody.scrollTop = chatBody.scrollHeight;
}

function openChat(nickname) {
    // Afficher la deuxième colonne (col-md-8)
    const col2 = document.querySelector('.col-md-8');
    col2.style.display = 'block';

    // Mettre à jour le titre de la fenêtre de chat
    const chatHeader = document.getElementById('chat-header');
    chatHeader.innerHTML = `Discussion avec <a href="/profile/${nickname}/">${nickname}</a>`;

    // Vérifier si une conversation avec ces utilisateurs existe déjà, et recupérer l'ID
    checkConversationID(nickname).then(conversationID => {
        openConversation(conversationID);
    });

    // Fonction pour vérifier si une conversation avec ces utilisateurs existe déjà
    async function checkConversationID(nickname) {
        const response = await fetch(`/api_chat/conversationID/${nickname}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });
        const data = await response.json();
        conversationData = data;  // Mettre à jour la variable globale
        return conversationData.id;  // Retourne l'ID de la conversation
    }

    // Fonction pour ouvrir une conversation via WebSocket
    async function openConversation(conversationID) {
        if (ws) {
            ws.close(); // Fermer l'ancienne connexion WebSocket, si elle existe
        }

        ws = new WebSocket(`ws://localhost:8888/ws/${conversationID}/messages/`);

        ws.onopen = function() {
            console.log('WebSocket connection opened for messages in conversation', conversationID);         // DEBUG
        }

        ws.onmessage = function(event) {
            const receivedMessage = JSON.parse(event.data);
            if (receivedMessage.sender === nickname) {
                displayMessage(receivedMessage);
            }
        }

        ws.onclose = function() {
            console.log('WebSocket connection closed');         // DEBUG
        }

        ws.onerror = function(event) {
            console.error('WebSocket error:', event);         // DEBUG
        }
    }
}

// Fonction principale
export function chatView(container) {
    container.innerHTML = '';

    // Création du WebSocket pour le statut des utilisateurs
    const statusSocket = new WebSocket('ws://localhost:8888/ws/status/');

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