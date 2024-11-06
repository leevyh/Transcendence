import { DEBUG, navigateTo } from '../../app.js';
import { play } from '../../views/pong_game.js';
import { getCookie } from '../../views/utils.js';
import { createChatWindow } from './visual.js';
import {decrementNotificationCount} from "../../views/notifications.js";


export let chatWS = null;

// Function to open a chat with a user
export function openChatWithUser(user) {
    // Get the chat window of the user
    const chat_user_id = `chat_user_${user.user_id}`;
    let chatWindow = document.getElementById(chat_user_id);

    // If the chat window already exists, show it and hide the others
    if (chatWindow) {
        if (DEBUG) {console.log('Chat window already exists for this user:', user.nickname);}
        chatWindow.classList.add('active'); // Show the chat window
        close_chatWindows(chatWindow);
    } else {
        if (DEBUG) {console.log('Chat window does not exist');}

        chatWindow = createChatWindow(user);
        chatWindow.classList.add('active');
        document.getElementById('chat-container').appendChild(chatWindow);
        close_chatWindows(chatWindow);
    }

    checkConversationID(user.nickname).then(conversationID => {
        getNotificationId(user.nickname);
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

// Function to hide and clear chat windows
function close_chatWindows(chatWindow) {
    if (DEBUG) {console.log('Hide and clear chat windows');}
    const chatWindows = document.querySelectorAll('.chat-window');
    chatWindows.forEach(window => {
        if (window !== chatWindow) {
            // clear the chat body
            window.querySelector('.chat-body').innerHTML = '';
            window.classList.remove('active');
        }
    });
}

//Function to select all div with class .nickname_${nickname} inside notification and get the id for each notification with this class
export function getNotificationId(nickname) {
    const notifications = document.querySelectorAll(`.nickname_${nickname}`);
    const notificationIds = [];
    notifications.forEach(notification => {
        notificationIds.push(notification.id);
    });
    // Remove the notifications divs and decrement the badge
    notificationIds.forEach(notificationId => {
        const notification = document.getElementById(notificationId);
        notification.remove();
        decrementNotificationCount();
    });
    // return notificationIds;
}


// Function to initialize the chat
async function openConversation(conversationID, user) {
    if (chatWS) {chatWS.close();} // Close the previous chat WebSocket

    chatWS = new WebSocket(`wss://${window.location.host}/ws/chat/${conversationID}/`);

    chatWS.onopen = function() {
        if (DEBUG) {console.log('Chat WebSocket OPEN - conversationID:', conversationID);}
    }

    chatWS.onmessage = function(event) {
        const receivedMessage = JSON.parse(event.data);
        if (DEBUG) {console.log('Chat WebSocket MESSAGE:', receivedMessage);}
        handleWSMessage(receivedMessage, user);
    }

    chatWS.onclose = function() {
        if (DEBUG) {console.log('Chat WebSocket CLOSE - conversationID:', conversationID);}
    }

    chatWS.onerror = function(event) {
        if (DEBUG) {console.error('Chat WebSocket ERROR:', event);}
    }
}

// Function to display a message in the chat
function displayMessage(messageData, otherUser) {
    // Get the chat body of the user
    const chatBody = document.getElementById(`chat_user_${otherUser.user_id}`).querySelector('.chat-body');
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

// Function to handle WebSocket messages
function handleWSMessage(receivedMessage, user) {
    if (receivedMessage.type === 'chat_history') {
        const conversation = receivedMessage.conversation;

        // If chat history exists, display the messages
        if (receivedMessage.messages.length > 0) {
            receivedMessage.messages.forEach(message => {
                displayMessage(message, user);
            });
        }
        // Enable or disable the chat according to the blocked status of the users
        if (conversation.me.blocked === false && conversation.other.blocked === false) {
            enableChat(conversation.other.id);
        } else {
            disableChat(conversation.other.id);
            disableChat(conversation.me.id);
            const blockUserButton = document.getElementById(conversation.other.id).querySelector('.block-button')
            if (conversation.me.blocked === true) { // If the current user is blocked
                blockUserButton.style.display = 'none';
            } else if (conversation.other.blocked === true) { // If the other user is blocked
                blockUserButton.style.color = 'green';
                blockUserButton.setAttribute('aria-label', `Unblock ${conversation.other.nickname}`); // Change the tooltip
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
        displayMessage(messageData, user);
    } else if (receivedMessage.type === 'user_blocked') {
        disableChat(receivedMessage.blocked);
        disableChat(receivedMessage.blocker);
        if (receivedMessage.blocked === receivedMessage.user) { // If the blocked user is the current user
            const blockUserButton = document.getElementById(receivedMessage.blocker).querySelector('.block-button')
            blockUserButton.style.display = 'none';
        } else if (receivedMessage.blocked !== receivedMessage.user) { // If the blocked user is the other user
            const blockUserButton = document.getElementById(receivedMessage.blocked).querySelector('.block-button')
            blockUserButton.style.color = 'green';
            blockUserButton.setAttribute('aria-label', 'Unblock user'); // Change the tooltip
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
            displayMessage(messageData, user);
        } else {
            if (DEBUG) {console.log('Game invite received from:', receivedMessage.sender.nickname);}
            const messageData = {
                type: 'game_invite',
                sender: receivedMessage.sender,
                message: receivedMessage.sender.nickname + " has invited you to play a game.",
                timestamp: receivedMessage.timestamp,
                user: receivedMessage.user
            };
            displayMessage(messageData, user);
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
                navigateTo('/pong');
        });
        messageDiv.appendChild(messageContent);
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
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
export function inviteUserToPlay(user) {
    if (DEBUG) console.log('Invite', user.nickname, 'to play a game.');
    if (chatWS && chatWS.readyState === WebSocket.OPEN) {
        const messageData = {
            type: 'game_invite',
            invited: user.user_id,
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

function disableChat(user_id) {
    const chatWindow_id = `chat_user_${user_id}`;
    // If the chatWindow exists, disable the chat
    if (document.getElementById(chatWindow_id)) {
        if (DEBUG) {console.log('Chat disabled for user_id:', user_id);}
        const chatInput = document.getElementById(chatWindow_id).querySelector('.chat-input');
        const chatSendButton = document.getElementById(chatWindow_id).querySelector('.chat-send-button');
        const inviteGameButton = document.getElementById(chatWindow_id).querySelector('.invite-game-button');

        if (chatInput && chatSendButton) {
            chatInput.disabled = true;
            chatSendButton.disabled = true;
            inviteGameButton.disabled = true;
        }
    }
}

function enableChat(user_id) {
    const chatWindow_id = `chat_user_${user_id}`;
    // If the chatWindow exists, enable the chat
    if (document.getElementById(chatWindow_id)) {
        if (DEBUG) {console.log('Chat enabled for user_id:', user_id);}
        const chatInput = document.getElementById(chatWindow_id).querySelector('.chat-input');
        const chatSendButton = document.getElementById(chatWindow_id).querySelector('.chat-send-button');
        const inviteGameButton = document.getElementById(chatWindow_id).querySelector('.invite-game-button');
        
        if (chatInput && chatSendButton) {
            chatInput.disabled = false;
            chatSendButton.disabled = false;
            inviteGameButton.disabled = false;
        }
    }
    // Change the block button color and tooltip
    const blockUserButton = document.getElementById(user_id).querySelector('.block-button')
    if (blockUserButton) {
        blockUserButton.style.color = 'red';
        blockUserButton.setAttribute('aria-label', `Block ${user_id}`); // Change the tooltip
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