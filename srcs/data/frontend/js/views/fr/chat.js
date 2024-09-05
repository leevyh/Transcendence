import { getCookie } from '../utils.js';

export function chatView() {
const app = document.getElementById('app');
    app.innerHTML = `
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4">
                <h5>Joueurs connectés</h5>
                <ul class="list-group" id="user-list">
                    <!-- Les joueurs connectés seront listés ici -->
                </ul>
            </div>
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header" id="chat-header">
                        Sélectionnez un joueur pour discuter
                    </div>
                    <div class="card-body" id="chat-body" style="height: 400px; overflow-y: scroll;">
                        <!-- Messages du chat -->
                    </div>
                    <div class="card-footer">
                        <div class="input-group">
                            <input type="text" id="chat-input" class="form-control" placeholder="Écrire un message...">
                            <button class="btn btn-primary" id="send-message">Envoyer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // Fonction pour charger les utilisateurs connectés
    function loadConnectedUsers() {
        fetch('/api_chat/connected_users/')
            .then(response => response.json())
            .then(users => {
                const userList = document.getElementById('user-list');
                userList.innerHTML = '';
                users.forEach(user => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.textContent = user.username;
                    listItem.addEventListener('click', () => {
                        openChat(user.id, user.username);
                    });
                    userList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Erreur lors du chargement des utilisateurs :', error));
    }

    let currentConversationId = null;
    let messageRefreshInterval = null;

    // Fonction pour ouvrir une conversation avec un utilisateur
    function openChat(userId, username) {
        document.getElementById('chat-header').textContent = `Discussion avec ${username}`;
        document.getElementById('chat-body').innerHTML = '';
        currentConversationId = null;

        let currentUserId = '';
        let currentUsername = '';

        fetch('/api_chat/current_user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            currentUserId = data.id;
            currentUsername = data.username;
            // console.log('Receiver ID:', userId, 'Username:', username);
            // console.log('Sender ID:', currentUserId, 'Username:', currentUsername);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'utilisateur connecté :', error);
        });
                
        // Créer une nouvelle conversation ou récupérer l'existante
        fetch(`/api_chat/start_conversation/${userId}/`)
            .then(response => response.json())
            .then(data => {
                currentConversationId = data.conversation_id;
                // console.log('Conversation Id:', currentConversationId);
                loadMessages(currentConversationId);

                // Mettre à jour les messages toutes les 5 secondes
                messageRefreshInterval = setInterval(() => {loadMessages(currentConversationId);}, 5000); // Intervalle de 5 secondes
            })
            .catch(error => console.error('Erreur lors de l\'ouverture de la conversation :', error));
    }

    // Fonction pour charger les messages d'une conversation
    function loadMessages(conversationId) {
        if (!conversationId) {
            console.error('Conversation ID non défini');
            return;
        }
        fetch(`/api_chat/messages/${conversationId}/`)
            .then(response => response.json())
            .then(messages => {
                const chatBody = document.getElementById('chat-body');
                chatBody.innerHTML = '';
                messages.forEach(msg => {
                    const msgElement = document.createElement('div');
                    msgElement.classList.add('mb-2');
                    msgElement.innerHTML = `<small>${msg.date} :</small>
                                            <strong>${msg.sender}</strong> :
                                            ${msg.content}`;
                    chatBody.appendChild(msgElement);
                });
            })
            .catch(error => console.error('Erreur lors du chargement des messages :', error));
    }

    // Fonction pour envoyer un message
    document.getElementById('send-message').addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (message && currentConversationId) {
            const formData = new FormData();
            formData.append('conversation_id', currentConversationId);
            formData.append('content', message);

            fetch(`/api_chat/send_message/${currentConversationId}/`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'Message envoyé') {
                        const msgElement = document.createElement('div');
                        msgElement.classList.add('mb-2');
                        msgElement.innerHTML = `<small>${data.date} :</small>
                                                <strong>${data.sender}</strong> :
                                                ${message}`;
                        document.getElementById('chat-body').appendChild(msgElement);
                        input.value = '';
                    }
                })
                .catch(error => console.error('Erreur lors de l\'envoi du message :', error));
        }
    });

    // Charger les utilisateurs connectés au chargement de la page
    loadConnectedUsers();

    // Refresh the list of online users every 30 seconds
    setInterval(loadConnectedUsers, 30000);
}
    