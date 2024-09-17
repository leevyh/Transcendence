import { getCookie } from '../utils.js';

let conversationData = {};
let ws = null;

// Fonction pour la liste des utilisateurs connectés
export function createUserCard(user, userList) {
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
export function createChatWindow() {
    const col2 = document.createElement('div');
    col2.style.display = 'none'; // Masqué par défaut
    col2.classList.add('col-md-8', 'col-lg-6', 'col-xl-4');

    // Création de la carte (card)
    const card = document.createElement('div');
    card.className = 'card';
    card.id = 'chat1';
    card.style.borderRadius = '15px';

    // Création de l'en-tête de la carte (card-header)
    const cardHeader = document.createElement('div');
    cardHeader.id = 'chat-header';
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center', 'p-3', 'bg-info', 'text-white', 'border-bottom-0');
    cardHeader.style.borderTopLeftRadius = '15px';
    cardHeader.style.borderTopRightRadius = '15px';

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

// Fonction pour ouvrir un chat
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
                displayMessage(receivedMessage, 'received-message');
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

// Fonction pour gérer les messages
function handleMessages(message) {
    const chatHeader = document.getElementById('chat-header');
    const receiver = chatHeader.textContent.split(' ')[2];

    if (ws && ws.readyState === WebSocket.OPEN) {
        const messageData = {
            type: 'chat_message',
            message: message,
            sender: conversationData.members[0].username === receiver ? conversationData.members[1].username : conversationData.members[0].username,
            timestamp: new Date().toISOString()
        };
        ws.send(JSON.stringify(messageData)); 
        displayMessage(messageData, 'sent-message');
        document.getElementById('chat-input').value = '';
    } else {
        console.error('WebSocket is not open.');        // DEBUG
    }
}

// Fonction pour afficher les messages
function displayMessage(messageData, messageID) {
    const chatBody = document.getElementById('chat-body');

    if (messageID === 'sent-message') {
// Si l'utilisateur est le sender, on affiche le message à droite
        const messageElement = document.createElement('div');
        messageElement.className = messageData.sender === localStorage.getItem('nickname') ? 'sent-message' : 'received-message';
        messageElement.classList.add('d-flex', 'flex-row', 'justify-content-start', 'mb-4');

        // Créer l'image
        const Avatar = conversationData.members[0].username === messageData.sender ? conversationData.members[0].avatar : conversationData.members[1].avatar;
        const img = document.createElement('img');
        img.src = `data:image/png;base64, ${Avatar}`;
        img.alt = 'avatar 1';
        img.style.width = '45px';
        img.style.height = '100%';


        // Créer la div du message
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('p-3', 'ms-3');
        messageDiv.style.borderRadius = '15px';
        messageDiv.style.backgroundColor = 'rgba(57, 192, 237, 0.2)';

        // Créer le paragraphe contenant le texte
        const paragraph = document.createElement('p');
        paragraph.classList.add('small', 'mb-0');
        paragraph.textContent = 'Hello and thank you for visiting MDBootstrap. Please click the video below.';
        paragraph.innerHTML = `
            <strong>${messageData.sender}:</strong> ${messageData.message} <br>
            <small>${new Date(messageData.timestamp).toLocaleTimeString()}</small>
        `;

        // Ajouter le paragraphe à la div du message
        messageDiv.appendChild(paragraph);
        // Ajouter l'image et la div du message à la div principale
        messageElement.appendChild(img);
        messageElement.appendChild(messageDiv);

        chatBody.appendChild(messageElement);

    } else if (messageID === 'received-message') {
// Si l'utilisateur est le receiver, on affiche le message à gauche
        const messageElement = document.createElement('div');
        messageElement.className = messageData.sender === localStorage.getItem('nickname') ? 'sent-message' : 'received-message';
        messageElement.classList.add('d-flex', 'flex-row', 'justify-content-end', 'mb-4');

        // Créer l'image
        const Avatar = conversationData.members[0].username === messageData.receiver ? conversationData.members[0].avatar : conversationData.members[1].avatar;
        const img = document.createElement('img');
        img.src = `data:image/png;base64, ${Avatar}`;
        img.alt = 'avatar 1';
        img.style.width = '45px';
        img.style.height = '100%';

        // Créer la div du message
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('p-3', 'ms-3', 'border', 'bg-body-tertiary');
        messageDiv.style.borderRadius = '15px';

        // Créer le paragraphe contenant le texte
        const paragraph = document.createElement('p');
        paragraph.classList.add('small', 'mb-0');
        paragraph.textContent = 'Hello and thank you for visiting MDBootstrap. Please click the video below.';
        paragraph.innerHTML = `
            <strong>${messageData.sender}:</strong> ${messageData.message} <br>
            <small>${new Date(messageData.timestamp).toLocaleTimeString()}</small>
        `;
        // Ajouter le paragraphe à la div du message
        messageDiv.appendChild(paragraph);
        messageElement.appendChild(messageDiv);
        messageElement.appendChild(img);
        chatBody.appendChild(messageElement);
    }
    chatBody.scrollTop = chatBody.scrollHeight;
}

// // Créer une div principale
// const mainDiv = document.createElement('div');
// mainDiv.classList.add('d-flex', 'flex-row', 'justify-content-start', 'mb-4');

// // Créer l'image
// const img = document.createElement('img');
// img.src = 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp';
// img.alt = 'avatar 1';
// img.style.width = '45px';
// img.style.height = '100%';

// // Créer la div du message
// const messageDiv = document.createElement('div');
// messageDiv.classList.add('p-3', 'ms-3');
// messageDiv.style.borderRadius = '15px';
// messageDiv.style.backgroundColor = 'rgba(57, 192, 237, 0.2)';

// // Créer le paragraphe contenant le texte
// const paragraph = document.createElement('p');
// paragraph.classList.add('small', 'mb-0');
// paragraph.textContent = 'Hello and thank you for visiting MDBootstrap. Please click the video below.';

// // Ajouter le paragraphe à la div du message
// messageDiv.appendChild(paragraph);

// // Ajouter l'image et la div du message à la div principale
// mainDiv.appendChild(img);
// mainDiv.appendChild(messageDiv);

// // Ajouter le tout à l'élément parent (par exemple, body ou une autre div)
// document.body.appendChild(mainDiv);  // ou utiliser une autre div spécifique si nécessaire