import { getCookie } from './utils.js';

export function chatView(container) {
//     // Clear previous content
//     container.innerHTML = '';

//     // Create the main container
//     const mainContainer = document.createElement('div');
//     mainContainer.classList.add('container', 'mt-3', 'p-5');

//     // Create the title
//     const title = document.createElement('h2');
//     title.textContent = 'Welcome to the chat!';

//     // Create the row
//     const row = document.createElement('div');
//     row.classList.add('row');

//     // Create the online users section
//     const onlineUsersSection = document.createElement('div');
//     onlineUsersSection.classList.add('mt-4');

//     const onlineUsersLabel = document.createElement('h4');
//     onlineUsersLabel.textContent = 'Users:';

//     const onlineUsersList = document.createElement('ul');
//     onlineUsersList.setAttribute('id', 'onlineUsersList');
//     onlineUsersList.classList.add('list-group');
    
//     // Append online users section to the row
//     onlineUsersSection.appendChild(onlineUsersLabel);
//     onlineUsersSection.appendChild(onlineUsersList);

//     // Create chat container
//     const chatContainer = document.createElement('div');
//     chatContainer.setAttribute('id', 'chat-container');
//     chatContainer.style.display = 'none'; // Hide by default

//     const chatHeader = document.createElement('div');
//     chatHeader.setAttribute('id', 'chat-header');
//     chatHeader.innerHTML = '<h3>Chat avec <span id="chat-user">Utilisateur</span></h3>';
    
//     const chatBox = document.createElement('div');
//     chatBox.setAttribute('id', 'chat-box');
    
//     const chatFooter = document.createElement('div');
//     chatFooter.setAttribute('id', 'chat-footer');

//     // Create input group in chat footer
//     const colDiv = document.createElement('div');
//     colDiv.classList.add('col-md-6');

//     const inputGroupDiv = document.createElement('div');
//     inputGroupDiv.classList.add('input-group');

//     const span = document.createElement('span');
//     span.classList.add('input-group-text');
//     span.setAttribute('id', 'basic-addon1');

//     const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
//     svgIcon.setAttribute('width', '16');
//     svgIcon.setAttribute('height', '16');
//     svgIcon.setAttribute('fill', 'currentColor');
//     svgIcon.classList.add('bi', 'bi-chat-dots');
//     svgIcon.setAttribute('viewBox', '0 0 16 16');

//     const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//     path1.setAttribute('d', 'M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2');

//     const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//     path2.setAttribute('d', 'm2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2');

//     svgIcon.appendChild(path1);
//     svgIcon.appendChild(path2);
//     span.appendChild(svgIcon);

//     const messageInput = document.createElement('input');
//     messageInput.setAttribute('type', 'text');
//     messageInput.classList.add('form-control');
//     messageInput.setAttribute('placeholder', 'Tapez un message...');
//     messageInput.setAttribute('aria-label', 'Tapez un message...');
//     messageInput.setAttribute('aria-describedby', 'basic-addon1');

//     inputGroupDiv.appendChild(span);
//     inputGroupDiv.appendChild(messageInput);
//     colDiv.appendChild(inputGroupDiv);

//     chatFooter.appendChild(colDiv);

//     chatContainer.appendChild(chatHeader);
//     chatContainer.appendChild(chatBox);
//     chatContainer.appendChild(chatFooter);

//     // Append title, row, and chat container to the main container
//     mainContainer.appendChild(title);
//     mainContainer.appendChild(row);
//     row.appendChild(onlineUsersSection);
//     mainContainer.appendChild(chatContainer);

//     // Append the main container to the provided container
//     container.appendChild(mainContainer);

//     // Fetch and display online users
//     function fetchOnlineUsers() {
//         fetch('api/status_user/')
//             .then(response => response.json())
//             .then(users => {
//                 onlineUsersList.innerHTML = '';
//                 users.forEach(user => {
//                     const listItem = document.createElement('li');
//                     listItem.classList.add('list-group-item');
//                     listItem.textContent = `${user.nickname} - ${user.status}`;
//                     listItem.setAttribute('data-nickname', user.nickname); // Use data attribute for nickname
//                     listItem.style.cursor = 'pointer'; // Show pointer cursor on hover
//                     onlineUsersList.appendChild(listItem);
//                 });
//             })
//             .catch(error => console.error('Error fetching online users:', error));
//     }

//     // Event delegation for clicking on user
//     onlineUsersList.addEventListener('click', (event) => {
//         const target = event.target;
//         if (target.tagName === 'LI') {
//             const nickname = target.getAttribute('data-nickname');
//             const chatHeaderUser = document.getElementById('chat-user');
//             const chatContainer = document.getElementById('chat-container');
//             chatHeaderUser.textContent = nickname;
//             chatContainer.style.display = 'block';

//             // Handle sending messages
//             function sendMessage() {
//                 const messageText = messageInput.value.trim();
//                 if (messageText) {
//                     addMessage(messageText, true); // true indicates the message is from the user
//                     messageInput.value = '';

//                     // Simulate receiving a reply from the server
//                     setTimeout(() => {
//                         addMessage('Réponse automatique: ' + messageText, false); // false indicates the message is from the system
//                     }, 500);
//                 }
//             }

//             // Add a message to the chat box
//             function addMessage(text, fromUser) {
//                 const messageElement = document.createElement('div');
//                 messageElement.classList.add('message');
//                 if (fromUser) {
//                     messageElement.classList.add('from-user');
//                 }
//                 messageElement.textContent = text;
//                 chatBox.appendChild(messageElement);
//                 chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
//             }

//             // Event listeners for send button and input field
//             const user = localStorage.getItem('username');
//             messageInput.addEventListener('keypress', (e) => {
//                 if (e.key === 'Enter') {
//                     e.preventDefault();
//                     fetch(`/api/chat/history/${user}/`, {
//                         method: 'PUT',                                                          // L'erreur vient d'ici !
//                         headers: {
//                             'Content-Type': 'application/json',
//                             'X-CSRFToken': getCookie('csrftoken')
//                         },
//                         body: JSON.stringify({ message: messageInput.value, recipient: nickname })
//                     })
//                     sendMessage();
//                 }
//             });
//         }
//     });

//     // Initial fetch of online users
//     fetchOnlineUsers();

//     // Refresh the list of online users every 30 seconds
//     setInterval(fetchOnlineUsers, 30000);
// }



    // Clear previous content
    container.innerHTML = '';

    // Create elements
    const h1 = document.createElement('h1');
    h1.textContent = 'Chat';

    // Création de la structure de la page de chat
    const row = document.createElement('div');
    row.className = 'row';
  
    // Colonne des utilisateurs
    const userColumn = document.createElement('div');
    userColumn.className = 'col-md-3';
    const userCard = document.createElement('div');
    userCard.className = 'card';
    const userCardHeader = document.createElement('div');
    userCardHeader.className = 'card-header';
    userCardHeader.textContent = 'Utilisateurs en ligne';

    const userList = document.createElement('ul');
    userList.className = 'list-group list-group-flush';
    userList.id = 'user-list';
  
    userCard.appendChild(userCardHeader);
    userCard.appendChild(userList);
    userColumn.appendChild(userCard);
  
    // Conteneur pour les fenêtres de chat
    const chatWindowsContainer = document.createElement('div');
    chatWindowsContainer.className = 'col-md-9';
    chatWindowsContainer.id = 'chat-windows-container';
  
    row.appendChild(userColumn);
    row.appendChild(chatWindowsContainer);
    container.appendChild(row);
  
    // Fonction pour créer un élément de la liste des utilisateurs
    function createUserListItem(user) {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
      listItem.textContent = user.nickname;
  
      const statusBadge = document.createElement('span');
      statusBadge.className = `badge rounded-pill ${user.status === 'connecté' ? 'bg-success' : 'bg-warning'}`;
      statusBadge.textContent = user.status;
  
      listItem.appendChild(statusBadge);
  
      listItem.addEventListener('click', function() {
        openChatWindow(user);
      });
  
      return listItem;
    }
  
    // Fonction pour ouvrir une fenêtre de chat
    function openChatWindow(user) {
      let chatWindow = document.getElementById(`chat-window-${user.id}`);
  
      // Si la fenêtre de chat n'existe pas encore, la créer
      if (!chatWindow) {
        chatWindow = document.createElement('div');
        chatWindow.id = `chat-window-${user.id}`;
        chatWindow.className = 'chat-window';
  
        const chatHeader = document.createElement('div');
        chatHeader.className = 'chat-header';
        chatHeader.textContent = user.nickname;
        chatHeader.addEventListener('click', function() {
          chatWindow.classList.toggle('active');
          chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
        });
  
        const chatBody = document.createElement('div');
        chatBody.className = 'chat-body';
  
        const chatFooter = document.createElement('div');
        chatFooter.className = 'chat-footer';
  
        const messageInput = document.createElement('input');
        messageInput.type = 'text';
        messageInput.className = 'form-control';
        messageInput.placeholder = 'Entrez votre message...';
  
        // Bouton d'envoi
        const sendButton = document.createElement('button');
        sendButton.className = 'btn btn-primary';
        sendButton.textContent = 'Envoyer';
        sendButton.addEventListener('click', function() {
            sendMessage(user.nickname, messageInput.value);
            messageInput.value = ''; // Clear input field after sending
        });
    
        chatFooter.appendChild(messageInput);
        chatFooter.appendChild(sendButton);
  
        chatWindow.appendChild(chatHeader);
        chatWindow.appendChild(chatBody);
        chatWindow.appendChild(chatFooter);
  
        document.body.appendChild(chatWindow);
      } else {
        chatWindow.style.display = 'flex';
      }
        // Start polling for new messages
        startPollingForMessages(user.nickname, chatWindow);
    }
  
    // Fonction pour récupérer la liste des utilisateurs depuis le backend
    function fetchUsers() {
      fetch('/api/status_user/')
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des utilisateurs connectés');
          }
          return response.json();
        })
        .then(users => {
          // Ajouter les utilisateurs à la liste
          userList.innerHTML = ''; // Clear existing list items
          users.forEach(user => {
            const userListItem = createUserListItem(user);
            userList.appendChild(userListItem);
          });
        })
        .catch(error => {
          console.error('Erreur:', error);
        });
    }

    // Fonction pour envoyer un message
    function sendMessage(nickname, message) {
        if (!message.trim()) return; // Do not send empty messages

        fetch(`/api/send-message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname, message })
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du message');
        }
        })
        .catch(error => {
        console.error('Erreur:', error);
        });
    }

    // Fonction pour démarrer le polling des messages
    function startPollingForMessages(nickname, chatWindow) {
        const chatBody = chatWindow.querySelector('.chat-body');
        setInterval(() => {
        fetch(`/api/get-messages/${nickname}`)
            .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des messages');
            }
            return response.json();
            })
            .then(data => {
                const messages = data.data || []; // Use data.data as it is the expected array
                chatBody.innerHTML = ''; // Clear existing messages
      
                if (Array.isArray(messages)) {
                  messages.forEach(message => {
                    if (message.username === username) { // Display only messages for the current chat
                      const messageElement = document.createElement('p');
                      messageElement.textContent = message.message;
                      chatBody.appendChild(messageElement);
                    }
                  });
            } else {
                console.error('Les messages ne sont pas au format attendu.');
            }
            })
            .catch(error => {
            console.error('Erreur:', error);
            });
        }, 3000); // Poll every 3 seconds
    }
  
    // Initialisation : récupérer la liste des utilisateurs au chargement de la page
    fetchUsers();

    // Refresh the list of online users every 10 seconds
    setInterval(fetchUsers, 10000);

    document.body.appendChild(container);
}
  