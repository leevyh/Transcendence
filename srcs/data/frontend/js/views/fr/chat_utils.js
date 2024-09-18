import { getCookie } from '../utils.js';

let ws = null;

// Function for global container creation
export async function createGlobalContainer() {
    const globalContainer = document.createElement('div');
    globalContainer.className = 'container-fluid container-chat';

    // Create the users container
    const usersContainer = await createUsersContainer();
    globalContainer.appendChild(usersContainer);

    // Create the chat container
    const chatContainer = await createChatContainer();
    globalContainer.appendChild(chatContainer);

    return globalContainer;
}

// Function for users container creation
async function createUsersContainer() {
    const usersContainer = document.createElement('div');
    usersContainer.className = 'col-md-4 users-container';

    const usersTitle = document.createElement('h5');
    usersTitle.setAttribute('data-i18n', 'onlineUsers'); // For multilingual support
    usersTitle.textContent = 'Online Users:';

    const usersList = document.createElement('ul');
    usersList.className = 'list-group';
    usersList.id = 'user-list';

    usersContainer.appendChild(usersTitle);
    usersContainer.appendChild(usersList);

    return usersContainer;
}

// Function for user card creation
export function createUserCard(user, userList) {
    let userCard = document.getElementById(user.nickname);

    // If the user card does not exist, create it
    if (!userCard) {
        userCard = document.createElement('div');
        userCard.className = 'card user-card';
        userCard.id = user.nickname; // ID = nickname

        const userCardBody = document.createElement('div');
        userCardBody.className = 'card-body user-connected';

        const userNickname = document.createElement('h5');
        userNickname.className = 'card-title';
        userNickname.textContent = user.nickname;

        const dot = document.createElement('span');
        dot.className = 'dot dot-status';

        // Create Block Button
        const blockUserButton = document.createElement('button');
        blockUserButton.className = 'btn btn-danger';
        blockUserButton.textContent = 'Bloquer';
        blockUserButton.addEventListener('click', () => {
            blockUser(user.nickname); // Pass the user ID to the blockUser function
        });

        // Create Unblock Button
        const unblockUserButton = document.createElement('button');
        unblockUserButton.className = 'btn btn-success';
        unblockUserButton.textContent = 'Débloquer';
        unblockUserButton.addEventListener('click', () => {
            unblockUser(user.nickname); // Pass the user ID to the unblockUser function
        });

        userCardBody.appendChild(dot);
        userCardBody.appendChild(userNickname);
        userCardBody.appendChild(blockUserButton);
        userCardBody.appendChild(unblockUserButton);
        userCard.appendChild(userCardBody);

        // Add click event to open chat
        userCard.addEventListener('click', () => {
            const isChatOpen = document.getElementById('chat-window');
            // If the chat is already open for this user, close it. Else, open it.
            if (isChatOpen.style.display === 'block' && isChatOpen.querySelector('.chat-title').textContent.includes(user.nickname)) {
                const chatBody = document.querySelector('.chat-body');
                chatBody.innerHTML = ''; // Clear chat body
                isChatOpen.style.display = 'none';
            } else {
                const chatBody = document.querySelector('.chat-body');
                chatBody.innerHTML = ''; // Clear chat body
                openChat(user.nickname);
                isChatOpen.style.display = 'block';
            }
        });

        userList.appendChild(userCard);
    }

    // Update the user's status
    const dot = userCard.querySelector('.dot');
    if (user.status === 'online') {
        dot.style.backgroundColor = 'green';
    } else if (user.status === 'offline') {
        // userCard.remove();
        dot.style.backgroundColor = 'red';
    } else if (user.status === 'in game') {
        dot.style.backgroundColor = 'orange';
    }
    return userCard;
}

// Function for chat container creation
async function createChatContainer() {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'col-md-8 chat-container';
    chatContainer.classList.add('col-md-8', 'col-lg-6', 'col-xl-4');

    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.id = 'chat-window';
    chatWindow.style.display = 'none'; // Initially hidden

    const chatHeader = await createChatHeader();
    chatWindow.appendChild(chatHeader);

    const chatBody = document.createElement('div');
    chatBody.className = 'chat-body';

    const chatFooter = document.createElement('div');
    chatFooter.className = 'chat-footer';

    const chatInputGroup = document.createElement('div');
    chatInputGroup.className = 'input-group';

    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.id = 'chat-input';
    chatInput.className = 'form-control';
    chatInput.placeholder = 'Type your message here...';
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            chatSendButton.click();
        }
    });

    const chatSendButton = document.createElement('button');
    chatSendButton.className = 'btn btn-primary';
    chatSendButton.textContent = 'Send';
    chatSendButton.addEventListener('click', () => {
        const message = chatInput.value;
        handleMessage(message);
        chatInput.value = ''; // Clear input after sending
    });

    chatInputGroup.appendChild(chatInput);
    chatInputGroup.appendChild(chatSendButton);
    chatFooter.appendChild(chatInputGroup);
    chatWindow.appendChild(chatBody);
    chatWindow.appendChild(chatFooter);
    chatContainer.appendChild(chatWindow);

    return chatContainer;
}

// Function for chat header creation
async function createChatHeader() {
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';

    const chatTitle = document.createElement('h5');
    chatTitle.className = 'chat-title';

    const buttonContainer = createChatHeaderButtons();

    chatHeader.appendChild(chatTitle);
    chatHeader.appendChild(buttonContainer);

    return chatHeader;
}

// Function for chat header buttons
function createChatHeaderButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
// INVITE GAME BUTTON
    const inviteGameButton = document.createElement('button');
    inviteGameButton.className = 'btn btn-primary';
    inviteGameButton.textContent = 'Invite to Game';
    inviteGameButton.addEventListener('click', (event) => {
        console.log('User invited to play Pong (TODO)');
        // TODO: Implement invite to game

        // creer un message de confirmation
        // const chatBody = document.querySelector('.chat-body');
        // const confirmationMessage = document.createElement('div');
        // confirmationMessage.className = 'alert alert-success';
        // confirmationMessage.textContent = 'User invited to play Pong!';
        // chatBody.appendChild(confirmationMessage);
        // chatBody.scrollTop = chatBody.scrollHeight;
    });

// USER PROFILE BUTTON
    const viewProfileButton = document.createElement('button');
    viewProfileButton.className = 'btn btn-light';
    viewProfileButton.addEventListener('click', (event) => {
        console.log('User profile opened (TODO)');
    });

    const svgUPlink = "http://www.w3.org/2000/svg";
    const svgUP = document.createElementNS(svgUPlink, "svg");
    svgUP.setAttribute("xmlns", svgUPlink);
    svgUP.setAttribute("width", "16");
    svgUP.setAttribute("height", "16");
    svgUP.setAttribute("fill", "currentColor");
    svgUP.setAttribute("class", "bi bi-person-lines-fill");
    svgUP.setAttribute("viewBox", "0 0 16 16");

    const pathUP = document.createElementNS(svgUPlink, "path");
    pathUP.setAttribute("d", "M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z");

    svgUP.appendChild(pathUP);
    viewProfileButton.appendChild(svgUP);

    buttonContainer.appendChild(viewProfileButton);
    buttonContainer.appendChild(inviteGameButton);

    return buttonContainer;
}

function openChat(user) {
    const chatTitle = document.querySelector('.chat-title');
    chatTitle.textContent = `Chat with ${user}`; // TODO: Add nickname and link to profile

    checkConversationID(user).then(conversationID => {
        openConversation(conversationID);
    });

    // Function to check if a conversation ID exists for the users, if not create one
    async function checkConversationID(user) {
        let response = null;
        await fetch(`/api_chat/conversationID/${user}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
            else if (response.status === 307) {
                localStorage.removeItem('token');
                fetch('/api/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                }).then(r => r.json())
                navigateTo('/login');
                return null;
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then(data => {
            response = data.id;
        })
        return response;  // Return the conversation ID
    }
}


// Function to display a message in the chat
function displayMessage(messageData) {
    const chatBody = document.querySelector('.chat-body');
    const messageElement = document.createElement('div');
    const imgAvatar = document.createElement('img');
    imgAvatar.className = 'avatar';
    const messageDiv = document.createElement('div');
    const messageContent = document.createElement('p');
    messageContent.className = 'message-content';

    if (messageData.sender.nickname === messageData.user) { // Means that the sender is the user
        messageElement.className = 'message sent-message';
        const Avatar = messageData.sender.avatar;
        imgAvatar.alt = 'Your avatar';
        imgAvatar.src = `data:image/png;base64, ${Avatar}`;
        messageDiv.className = 'message-div';
        messageContent.innerHTML = `
            <strong>${messageData.sender.nickname}:</strong> ${messageData.message} <br>
            <small>${new Date(messageData.timestamp).toLocaleTimeString()}</small>
        `;
        messageDiv.appendChild(messageContent);
        messageElement.appendChild(messageDiv);
        messageElement.appendChild(imgAvatar);
    } else { // Means that the sender is the other user
        messageElement.className = 'message received-message';
        const Avatar = messageData.sender.avatar;
        imgAvatar.alt = 'Other user avatar';
        imgAvatar.src = `data:image/png;base64, ${Avatar}`;
        messageDiv.className = 'message-div-received';
        messageContent.innerHTML = `
            <strong>${messageData.sender.nickname}:</strong> ${messageData.message} <br>
            <small>${new Date(messageData.timestamp).toLocaleTimeString()}</small>
        `;
        messageDiv.appendChild(messageContent);
        messageElement.appendChild(imgAvatar);
        messageElement.appendChild(messageDiv);
    }
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Function to send a message
export function handleMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        const messageData = {
            type: 'chat_message',
            message: message,
            timestamp: new Date().toISOString()
        };
        ws.send(JSON.stringify(messageData)); 
    } else {
        console.error('WebSocket is not open.');        // DEBUG
    }
}

// Function to initialize the chat
export async function openConversation(conversationID) {
    // Fermer l'ancienne connexion WebSocket, si elle existe
    if (ws) {ws.close();}

    ws = new WebSocket('ws://' + window.location.host + `/ws/${conversationID}/messages/`);

    ws.onopen = function() {
        // console.log('WebSocket OK - conversationID:', conversationID);         // DEBUG
    }

    ws.onmessage = function(event) {
        // Handle incoming messages
        const receivedMessage = JSON.parse(event.data);

        if (receivedMessage.type === 'chat_history') {
            if (receivedMessage.messages.length > 0) {
                receivedMessage.messages.forEach(message => {
                    displayMessage(message);
                });
            }
        } else if (receivedMessage.type === 'chat_message') {
            const messageData = {
                sender: receivedMessage.sender,
                message: receivedMessage.message,
                timestamp: receivedMessage.timestamp,
                user: receivedMessage.user
            };
            displayMessage(messageData);
        } else if (receivedMessage.type === 'block_user') {
            console.log('receivedMessage.type', receivedMessage.type);      // FIXME
            // Si vous êtes le destinataire du blocage, gérer la situation ici
            if (receivedMessage.blocked_id === currentUser.id) {
                alert('You have been blocked by this user.');
                // Désactiver les fonctionnalités de chat avec cet utilisateur
                disableChatForBlockedUser(receivedMessage.blocked_id);
            }
        } else if (receivedMessage.type === 'unblock_user') {
            console.log('receivedMessage.type', receivedMessage.type);      // FIXME
            // Si vous êtes le destinataire du déblocage
            if (receivedMessage.blocked_id === currentUser.id) {
                alert('You have been unblocked.');
                // Réactiver les fonctionnalités de chat avec cet utilisateur
                enableChatForUnblockedUser(receivedMessage.blocked_id);
            }
        }
    }

    ws.onclose = function() {
        // console.log('WebSocket connection closed');         // DEBUG
    }

    ws.onerror = function(event) {
        console.error('WebSocket error:', event);         // DEBUG
    }
}



//                  BLOCK/UNBLOCK USER FUNCTIONALITIES                  //

// Function to block a user
function blockUser(blockedUser) {
    fetch('/api_chat/block/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'blocked': blockedUser
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log("User has been blocked.");

            // Send a notification via WebSocket
            if (ws && ws.readyState === WebSocket.OPEN) {
                const messageData = {
                    type: 'block_user',
                    blocked: blockedUser
                };
                ws.send(JSON.stringify(messageData));
            }
        } else if (data.error) {
            if (data.error === 'User already blocked') {
                console.log("This user has already been blocked.");
            }
        }
    });
}

// Function to unblock a user
function unblockUser(blockedUser) {
    fetch('/api_chat/unblock/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'blocked': blockedUser
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log("User has been unblocked.");

            // Send a notification via WebSocket
            if (ws && ws.readyState === WebSocket.OPEN) {
                const messageData = {
                    type: 'unblock_user',
                    blocked: blockedUser
                };
                ws.send(JSON.stringify(messageData));
            }
        } else if (data.error) {
            if (data.error === 'User not blocked') {
                console.log("This user haven't been blocked.");
            }
        }
    });
}

function disableChatForBlockedUser(blockedUser) {
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.querySelector('.btn-primary');
    
    if (chatInput && chatSendButton) {
        chatInput.disabled = true;
        chatSendButton.disabled = true;
        alert(`You cannot chat with user ${blockedUser} as they have blocked you.`);                 // A CHANGER
    }
}

function enableChatForUnblockedUser(blockedUser) {
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.querySelector('.btn-primary');
    
    if (chatInput && chatSendButton) {
        chatInput.disabled = false;
        chatSendButton.disabled = false;
        alert(`You can now chat with user ${blockedUser}.`);                 // A CHANGER
    }
}

//                  BLOCK/UNBLOCK USER FUNCTIONALITIES                  //