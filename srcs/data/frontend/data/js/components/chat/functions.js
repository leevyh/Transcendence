import { DEBUG, navigateTo } from '../../app.js';
import { play } from '../../views/pong_game.js';
import { getCookie } from '../../views/utils.js';

export let chatWS = null;

// Function to open a chat with a user
export function openChatWithUser(user) {
    checkConversationID(user).then(conversationID => {
        // Reset the chat title
        const chatTitle = document.querySelector('.chat-title');
        chatTitle.textContent = 'Chat Window';
        openConversation(conversationID, user);
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
                navigateTo('/'); // Redirect to home page if the user is not authenticated
                return null;
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then(data => {
            response = data.id;
        })
        return response;
    }
}

// Function to initialize the chat
async function openConversation(conversationID, otherUser) {
    if (chatWS) {chatWS.close();}

    // Update the chat title with the other user's nickname
    const chatTitle = document.querySelector('.chat-title');
    chatTitle.textContent = `Chat with ${otherUser}`;

    // Display the view profile button and the invite game button
    const profileButton = document.getElementById('view-profile-button');
    profileButton.style.display = 'block';
    profileButton.addEventListener('click', () => {
        // Call API to get the list of users and find the user we want to see the profile
        fetch(`/api/users/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => response.json())
        .then(data => {
            // Get the user we want to see the profile
            const otherUser_id = data.find(user => user.nickname === otherUser).user_id;
            if (!otherUser_id) {
                console.error('User not found');
                navigateTo('/404');
            }
            // Redirect to the profile page of the user
            navigateTo(`/profile/${otherUser_id}`);
        });
    });

    const inviteGameButton = document.querySelector('.invite-game-button');
    inviteGameButton.style.display = 'block';
    inviteGameButton.addEventListener('click', () => {
        inviteUserToPlay();
    });

    chatWS = new WebSocket(`wss://${window.location.host}/ws/chat/${conversationID}/`);

    chatWS.onopen = function() {
        if (DEBUG) {console.log('Chat WebSocket OPEN - conversationID:', conversationID);}
    }

    chatWS.onmessage = function(event) {
        const receivedMessage = JSON.parse(event.data);
        if (DEBUG) {console.log('Chat WebSocket MESSAGE:', receivedMessage);}

        if (receivedMessage.type === 'chat_history') {
            const conversation = receivedMessage.conversation;

            // If chat history exists, display the messages
            if (receivedMessage.messages.length > 0) {
                receivedMessage.messages.forEach(message => {
                    displayMessage(message);
                });
            }

            if (conversation.me.blocked === false && conversation.other.blocked === false) {
                enableChat(conversation.other.id);
            } else {
                disableChat();
                const blockUserButton = document.getElementById(conversation.other.id).querySelector('.block-button')
                if (conversation.me.blocked === true) { // If the current user is blocked
                    blockUserButton.style.display = 'none';
                } else if (conversation.other.blocked === true) { // If the other user is blocked
                    blockUserButton.style.color = 'green';
                    blockUserButton.style.display = 'block';
                }
            }
        } else if (receivedMessage.type === 'chat_message') {
            const messageData = {
                type: 'chat_message',
                sender: receivedMessage.sender,
                message: receivedMessage.message,
                timestamp: receivedMessage.timestamp,
                user: receivedMessage.user
            };
            displayMessage(messageData);
        } else if (receivedMessage.type === 'user_blocked') {
            disableChat();
            if (receivedMessage.blocked === receivedMessage.user) { // If the blocked user is the current user
                const blockUserButton = document.getElementById(receivedMessage.blocker).querySelector('.block-button')
                blockUserButton.style.display = 'none';
            } else if (receivedMessage.blocked !== receivedMessage.user) { // If the blocked user is the other user
                const blockUserButton = document.getElementById(receivedMessage.blocked).querySelector('.block-button')
                blockUserButton.style.color = 'green';
                blockUserButton.style.display = 'block';
            }
        } else if (receivedMessage.type === 'user_unblocked') {
            if (receivedMessage.blocked === receivedMessage.user) {
                enableChat(receivedMessage.blocker);
            } else if (receivedMessage.blocked !== receivedMessage.user) {
                enableChat(receivedMessage.blocked);
            }
        } else if (receivedMessage.type === 'game_invite') {
            if (receivedMessage.sender.nickname === receivedMessage.user) {
                if (DEBUG) {console.log('Game invite sent to:', receivedMessage.receiver);}
                const messageData = {
                    type: 'game_invite',
                    sender: receivedMessage.sender,
                    message: "Game invite sent to " + receivedMessage.receiver,
                    timestamp: receivedMessage.timestamp,
                    user: receivedMessage.user
                };
                displayMessage(messageData);
            } else {
                if (DEBUG) {console.log('Game invite received from:', receivedMessage.sender.nickname);}
                const messageData = {
                    type: 'game_invite',
                    sender: receivedMessage.sender,
                    message: receivedMessage.sender.nickname + " has invited you to play a game.",
                    timestamp: receivedMessage.timestamp,
                    user: receivedMessage.user
                };
                displayMessage(messageData);
            }
        } else if (receivedMessage.type === 'accept_game_invite') {
            if (DEBUG) {console.log('Game invite accepted by:', receivedMessage.sender.nickname);}
            // Display a message to say that the game invite has been accepted
            const chatBody = document.querySelector('.chat-body');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'd-flex justify-content-end mb-4 mr-2';
            const messageContent = document.createElement('p');
            messageContent.className = 'chat-msg position-relative accept-msg';
            messageContent.innerHTML = `
                Game invite accepted.
                <button class="btn btn-success join-button mt-2">Join the game</button>
                <span class="msg-time position-absolute end-0">${new Date(receivedMessage.timestamp).toLocaleTimeString()}</span>
            `;
            // Create a button to join the game
            const joinButton = messageContent.querySelector('.join-button');
            joinButton.addEventListener('click', () => {
                if (DEBUG) {console.log('Join game');}
                // Join the game
                // play(receivedMessage.gameID);
            });
            messageDiv.appendChild(messageContent);
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    chatWS.onclose = function() {
        if (DEBUG) {console.log('Chat WebSocket CLOSE - conversationID:', conversationID);}
    }

    chatWS.onerror = function(event) {
        if (DEBUG) {console.error('Chat WebSocket ERROR:', event);}
    }
}

// Function to display a message in the chat
function displayMessage(messageData) {
    const chatBody = document.querySelector('.chat-body');
    const messageDiv = document.createElement('div');
    chatBody.appendChild(messageDiv);
    const messageContent = document.createElement('p');

    // Avatar
    const Avatar = messageData.sender.avatar;
    const imgAvatar = document.createElement('img');
    imgAvatar.className = 'rounded-circle avatar';
    imgAvatar.src = `data:image/png;base64, ${Avatar}`;

    if (messageData.sender.nickname === messageData.user) {
        imgAvatar.alt = 'Your avatar';
        messageDiv.className = 'd-flex justify-content-end mb-4 mr-2';
        messageContent.className = 'chat-msg position-relative sent-msg';
        messageContent.innerHTML = `
            ${messageData.message}
            <span class="msg-time position-absolute end-0">${new Date(messageData.timestamp).toLocaleTimeString()}</span>
        `;
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(imgAvatar);
    } else {
        imgAvatar.alt = 'Other user avatar';
        messageDiv.className = 'd-flex justify-content-start mb-4 ml-2';
        messageContent.className = 'chat-msg position-relative received-msg';
        if (messageData.type === 'game_invite') {
            messageContent.innerHTML = `
                ${messageData.message}
                <button class="btn btn-success accept-button mt-2">Accept</button>
                <span class="msg-time position-absolute start-0">${new Date(messageData.timestamp).toLocaleTimeString()}</span>
            `;
            const acceptButton = messageContent.querySelector('.accept-button');
            acceptButton.addEventListener('click', () => {
                acceptGameInvite(messageData.sender.nickname);
                // Hide the accept button
                acceptButton.style.display = 'none';
            });
        } else if (messageData.message == 'Game invite send to ' + messageData.user) {
            messageContent.innerHTML = `
                ${messageData.sender.nickname} has invited you to play a game.
                <button class="btn btn-success accept-button mt-2">Accept</button>
                <span class="msg-time position-absolute start-0">${new Date(messageData.timestamp).toLocaleTimeString()}</span>
            `;
            const acceptButton = messageContent.querySelector('.accept-button');
            acceptButton.addEventListener('click', () => {
                acceptGameInvite(messageData.sender.nickname);
                // Hide the accept button
                acceptButton.style.display = 'none';
            });
        } else {
            messageContent.innerHTML = `
                ${messageData.message}
                <span class="msg-time position-absolute start-0">${new Date(messageData.timestamp).toLocaleTimeString()}</span>
            `;
        }
        messageDiv.appendChild(imgAvatar);
        messageDiv.appendChild(messageContent);

    }
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Function to send a message
export function handleMessage(message) {
    if (chatWS && chatWS.readyState === WebSocket.OPEN) {
        const messageData = {
            type: 'chat_message',
            message: message,
            timestamp: new Date().toISOString()
        };
        chatWS.send(JSON.stringify(messageData));
    } else {
        if (DEBUG) {console.error('Chat WebSocket is not open.');}
    }
}

// Function to invite a user to play
export function inviteUserToPlay() {
    // Recupérer le nom de l'utilisateur à inviter via le titre du chat
    const chatTitle = document.querySelector('.chat-title');
    const otherUser = chatTitle.textContent.split(' ')[2];
    console.log('Invite', otherUser, 'to play a game.');
    if (chatWS && chatWS.readyState === WebSocket.OPEN) {
        const messageData = {
            type: 'game_invite',
            invited: otherUser,
            timestamp: new Date().toISOString()
        };
        chatWS.send(JSON.stringify(messageData));
    }
}

// Function to accept a game invite
export function acceptGameInvite(fromUser) {
    if (chatWS && chatWS.readyState === WebSocket.OPEN) {
        const messageData = {
            type: 'accept_game_invite',
            invitation_from: fromUser,
            timestamp: new Date().toISOString()
        };
        chatWS.send(JSON.stringify(messageData));
    }
}

// Function to block/unblock a user
export function blockUnblockUser(user) {
    if (chatWS && chatWS.readyState === WebSocket.OPEN) {
        const messageData = {
            type: 'block_user',
            blocked: user
        };
        chatWS.send(JSON.stringify(messageData));
    }
}

function disableChat() {
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.querySelector('.chat-send-button');
    const inviteGameButton = document.querySelector('.invite-game-button');

    if (chatInput && chatSendButton) {
        chatInput.disabled = true;
        chatSendButton.disabled = true;
        inviteGameButton.disabled = true;
    }
}

function enableChat(otherUser) {
    if (DEBUG) {console.log('Chat enabled for:', otherUser);}
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.querySelector('.chat-send-button');
    const inviteGameButton = document.querySelector('.invite-game-button');
    const blockUserButton = document.getElementById(otherUser).querySelector('.block-button')

    if (chatInput && chatSendButton) {
        chatInput.disabled = false;
        chatSendButton.disabled = false;
        inviteGameButton.disabled = false;
        blockUserButton.style.color = 'red';
        blockUserButton.style.display = 'block';
    }
}

// Function to display the list of users
export function displayUsers(users, search = '') {
    const userList = document.getElementById('user-list');
    let usersArray = Array.from(users);

    // Filter users according to the search (by their nickname in userCard.textContent)
    let filteredUsers = usersArray.filter(user =>
        user.textContent.toLowerCase().startsWith(search.toLowerCase())
    );

    // Sort users by alphabetical order
    filteredUsers.sort((a, b) => 
        a.textContent.toLowerCase().localeCompare(b.textContent.toLowerCase())
    );

    // Display or hide users according to the search
    usersArray.forEach(user => {
        if (filteredUsers.includes(user)) {
            user.classList.remove('invisible');
        } else {
            user.classList.add('invisible');
        }
    });

    // Reorder the users in the user list
    filteredUsers.forEach((user, index) => {
        if (userList.children[index] !== user) {
            userList.insertBefore(user, userList.children[index]);
        }
    });
}