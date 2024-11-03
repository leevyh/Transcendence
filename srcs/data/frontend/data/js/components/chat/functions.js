import { DEBUG, navigateTo } from '../../app.js';
import { getCookie } from '../../views/utils.js';

export let chatWS = null;

// Function to open a chat with a user
export function openChatWithUser(user) {
    checkConversationID(user).then(conversationID => {
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
        console.log('Invite to play (TODO)');
    });

    chatWS = new WebSocket('ws://' + window.location.host + `/ws/chat/${conversationID}/`);

    chatWS.onopen = function() {
        if (DEBUG) {console.log('Chat WebSocket OPEN - conversationID:', conversationID);}
    }

    chatWS.onmessage = function(event) {
        const receivedMessage = JSON.parse(event.data);
        if (DEBUG) {console.log('Chat WebSocket MESSAGE:', receivedMessage);}

        if (receivedMessage.type === 'chat_history') {
            // Get the conversation data: Users info (nickname, avatar, blocked_status)
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
        messageContent.innerHTML = `
            ${messageData.message}
            <span class="msg-time position-absolute start-0">${new Date(messageData.timestamp).toLocaleTimeString()}</span>
        `;
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