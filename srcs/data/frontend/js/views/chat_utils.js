import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';
export let chatWS = null;


export async function createGlobalContainer() {
    const globalContainer = document.createElement('div');
    globalContainer.className = 'h-100 w-100 d-flex justify-content-center overflow-auto';

    const separator = document.createElement('div');
    separator.className = 'row h-100 w-75';
    globalContainer.appendChild(separator);

    const usersContainer = await createUsersContainer();
    separator.appendChild(usersContainer);

    const chatContainer = await createChatContainer();
    separator.appendChild(chatContainer);

    return globalContainer;
}

async function createUsersContainer() {
    const usersContainer = document.createElement('div');
    usersContainer.className = 'col-md-4 col-xl-4 align-content-center contacts';

    const contactsCard = document.createElement('div');
    contactsCard.className = 'card mb-sm-3 mb-md-0 h-75 shadow-sm contacts-card';
    usersContainer.appendChild(contactsCard);

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group p-2';
    contactsCard.appendChild(inputGroup);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.className = 'form-control border-0 search';
    inputGroup.appendChild(searchInput);

    const inputGroupPrepend = document.createElement('div');
    inputGroupPrepend.className = 'input-group-prepend';
    inputGroup.appendChild(inputGroupPrepend);

    const searchIcon = document.createElement('span');
    searchIcon.className = 'btn search-btn';
    searchIcon.innerHTML = '<i class="bi bi-search"></i>';
    inputGroupPrepend.appendChild(searchIcon);

    const contactsBody = document.createElement('div');
    contactsBody.className = 'card-body w-100 h-100 overflow-auto contacts-body';
    contactsCard.appendChild(contactsBody);

    const usersList = document.createElement('ul');
    usersList.className = 'p-2 user-list';
    usersList.id = 'user-list';
    contactsBody.appendChild(usersList);

    return usersContainer;
}

export function createUserCard(user, userList) {
    let userCard = document.getElementById(user.nickname);
    if (DEBUG) {console.log('User:', user);}

    if (!userCard) {
        userCard = document.createElement('div');
        userCard.className = 'd-flex align-items-center bd-highlight justify-content-between w-100';
        userCard.id = user.nickname; // ID = nickname
        userList.appendChild(userCard);

        const userStatusDot = document.createElement('span');
        userStatusDot.className = 'rounded-circle status-icon';
        userCard.appendChild(userStatusDot);
        
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `<span>${user.nickname}</span>`;
        userCard.appendChild(userInfo);
        
        const userStatus = document.createElement('p');
        userStatus.className = 'user-status';
        userStatus.textContent = 'offline';
        userInfo.appendChild(userStatus);
        userInfo.addEventListener('click', () => {
            const chatTitle = document.querySelector('.chat-title');
            if (chatTitle.textContent === `Chat with ${user.nickname}`) {
                return;
            } else {
                const chatBody = document.querySelector('.chat-body');
                chatBody.innerHTML = '';
                openChatWithUser(user.nickname);
            }
        });

        const blockButton = document.createElement('button');
        blockButton.className = "bi bi-slash-circle block-button";
        blockButton.style.color = 'red';
        blockButton.style.display = 'none'; // Hide the button
        blockButton.addEventListener('click', () => {
            blockUnblockUser(user.nickname);
        });
        userCard.appendChild(blockButton);

    }

    const userStatus = userCard.querySelector('.user-status');
    userStatus.textContent = user.status;

    const userStatusDot = userCard.querySelector('.status-icon');
    if (user.status === 'online') {
        userStatusDot.style.backgroundColor = 'green';
    } else if (user.status === 'offline') {
        userStatusDot.style.backgroundColor = 'red';
    } else if (user.status === 'playing') {
        userStatusDot.style.backgroundColor = 'orange';
    }

    return userCard;
}

async function createChatContainer() {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'col-md-4 col-xl-4 align-content-center chat';

    const chatCard = document.createElement('div');
    chatCard.className = 'card h-75 chat-card';
    chatCard.id = 'chat-window';
    chatContainer.appendChild(chatCard);

    const chatHeader = await createChatContainerHeader();
    chatCard.appendChild(chatHeader);

    const chatBody = document.createElement('div');
    chatBody.className = 'card-body chat-body';
    chatCard.appendChild(chatBody);

    const chatFooter = await createChatContainerFooter();
    chatCard.appendChild(chatFooter);

    return chatContainer;
}

async function createChatContainerHeader() {
    const chatHeader = document.createElement('div');
    chatHeader.className = 'card-header d-flex justify-content-between chat-header';

    const div1 = document.createElement('div');
    div1.className = 'd-flex align-items-center';
    chatHeader.appendChild(div1);

    const userImgChat = document.createElement('img');
    userImgChat.style.display = 'none'; // Hide the user image
    userImgChat.alt = 'user-img';
    userImgChat.className = 'rounded-circle user-img-chat';
    div1.appendChild(userImgChat);

    const chatTitle = document.createElement('span');
    chatTitle.textContent = 'Chat Window';
    chatTitle.className = 'chat-title';
    div1.appendChild(chatTitle);

    const div2 = document.createElement('div');
    div2.className = 'd-flex align-items-center';
    chatHeader.appendChild(div2);

    // Create a button to see the user's profile
    const profileButton = document.createElement('button');
    profileButton.style.display = 'none'; // Hide the button
    profileButton.id = 'view-profile-button';
    profileButton.className = 'btn btn-outline-light view-profile-button';
    profileButton.innerHTML = '<i class="bi bi-person-lines-fill"></i>';
    div2.appendChild(profileButton);

    // Create a button to block the user
    const blockButton = document.createElement('button');
    blockButton.style.display = 'none'; // Hide the button
    blockButton.id = 'block-button'; // btn-outline-danger ou btn-outline-success
    blockButton.className = 'btn btn-outline-danger block-button';
    blockButton.innerHTML = '<i class="bi bi-slash-circle"></i>';
    div2.appendChild(blockButton);

    const inviteGameButton = document.createElement('button');
    inviteGameButton.style.display = 'none'; // Hide the button
    // inviteGameButton.id = 'invite-game-button';
    inviteGameButton.className = 'btn btn-outline-primary invite-game-button';
    // inviteGameButton.style.display = 'none'; // Hide the button
    inviteGameButton.innerHTML = '<i class="bi bi-controller"></i>';
    div2.appendChild(inviteGameButton);

    return chatHeader;
}

async function createChatContainerFooter() {
    const chatFooter = document.createElement('div');
    chatFooter.className = 'card-footer w-100 p-2';

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    chatFooter.appendChild(inputGroup);

    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.id = 'chat-input';
    chatInput.className = 'form-control border-0 chat-input';
    chatInput.placeholder = 'Type your message...';
    inputGroup.appendChild(chatInput);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && chatInput.value !== '') {
            chatSendButton.click();
        }
    });

    const chatSendButton = document.createElement('span');
    chatSendButton.className = 'btn send-btn chat-send-button';
    chatSendButton.innerHTML = '<i class="bi bi-chevron-up"></i>'; // TODO: Add the event listener to send the message
    inputGroup.appendChild(chatSendButton);
    chatSendButton.addEventListener('click', () => {
        const message = chatInput.value;
        if (message !== '') {
            handleMessage(message);
            chatInput.value = '';
        }
    });

    return chatFooter;
}


function openChatWithUser(user) {
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
        return response;  // Return the conversation ID
    }
}

// Function to display a message in the chat
function displayMessage(messageData) {
    const chatBody = document.querySelector('.chat-body');
    const messageElement = document.createElement('div');
    const imgAvatar = document.createElement('img');
    imgAvatar.className = 'rounded-circle avatar';
    const messageDiv = document.createElement('div');
    const messageContent = document.createElement('p');
    messageContent.className = 'message-content';

    if (messageData.sender.nickname === messageData.user) {
        messageElement.className = 'd-flex';
        const Avatar = messageData.sender.avatar;
        imgAvatar.alt = 'Your avatar';
        imgAvatar.src = `data:image/png;base64, ${Avatar}`;
        messageDiv.className = 'd-flex justify-content-end mb-4 mr-2';
        messageContent.className = 'sent-msg';
        messageContent.innerHTML = `
            <strong>${messageData.sender.nickname}:</strong> ${messageData.message} <br>
            <small><span class="sent-msg-time">${new Date(messageData.timestamp).toLocaleTimeString()}</span></small>
        `;
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(imgAvatar);
        messageElement.appendChild(messageDiv);
    } else {
        messageElement.className = 'd-flex';
        const Avatar = messageData.sender.avatar;
        imgAvatar.alt = 'Other user avatar';
        imgAvatar.src = `data:image/png;base64, ${Avatar}`;
        messageDiv.className = 'd-flex justify-content-start mb-4 ml-2'; 
        messageContent.className = 'received-msg';
        messageContent.innerHTML = `
            <strong>${messageData.sender.nickname}:</strong> ${messageData.message} <br>
            <small><span class="received-msg-time">${new Date(messageData.timestamp).toLocaleTimeString()}</span></small>
        `;
        messageDiv.appendChild(imgAvatar);
        messageDiv.appendChild(messageContent);
        messageElement.appendChild(messageDiv);
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
        if (DEBUG) {console.error('WebSocket is not open.');}
    }
}

// Function to initialize the chat
export async function openConversation(conversationID, otherUser) {
    if (chatWS) {chatWS.close();}

    // Update the chat title and the user status
    const chatTitle = document.querySelector('.chat-title');
    chatTitle.textContent = `Chat with ${otherUser}`;
    const statusIconChat = document.querySelector('.status-icon');
    statusIconChat.style.display = 'block'; // Show the status icon

    // Afficher les boutons profil et inviter à jouer
    const profileButton = document.getElementById('view-profile-button');
    profileButton.style.display = 'block';
    profileButton.addEventListener('click', () => {
        navigateTo(`/user/${otherUser}`);
    });

    const inviteGameButton = document.querySelector('.invite-game-button');
    inviteGameButton.style.display = 'block';
    inviteGameButton.addEventListener('click', () => {
        console.log('Invite to play (TODO)');
    });

    chatWS = new WebSocket('ws://' + window.location.host + `/ws/${conversationID}/`);

    chatWS.onopen = function() {
        if (DEBUG) {console.log('WebSocket OPEN - conversationID:', conversationID);}
    }

    chatWS.onmessage = function(event) {
        // Handle incoming messages
        const receivedMessage = JSON.parse(event.data);
        if (DEBUG) {console.log('WebSocket MESSAGE:', receivedMessage);}

        if (receivedMessage.type === 'chat_history') {
            const userImgChat = document.querySelector('.user-img-chat');
            userImgChat.src = `data:image/png;base64, ${receivedMessage.conversation.other.avatar}`; // Update the user image
            userImgChat.style.display = 'block'; // Show the user image

            if (receivedMessage.messages.length > 0) {
                receivedMessage.messages.forEach(message => {
                    displayMessage(message);
                });
            }
            if (receivedMessage.conversation.me.blocked === false && receivedMessage.conversation.other.blocked === false) {
                enableChat(receivedMessage.conversation);
                const blockUserButton = document.getElementById(otherUser).querySelector('.block-button')
                blockUserButton.style.color = 'red';
                blockUserButton.style.display = 'block';
            } else {
                disableChat(receivedMessage.conversation);
                if (receivedMessage.conversation.me.blocked === true) {
                    // Si l'utilisateur bloqué est l'utilisateur courant
                    const blockUserButton = document.getElementById(receivedMessage.conversation.other.nickname).querySelector('.block-button')
                    blockUserButton.style.display = 'none';
                } else if (receivedMessage.conversation.other.blocked === true) {
                    // Si l'utilisateur bloqué est l'autre utilisateur
                    const blockUserButton = document.getElementById(receivedMessage.conversation.other.nickname).querySelector('.block-button')
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
            disableChat(receivedMessage);
            if (receivedMessage.blocked === receivedMessage.user) {
                // Si l'utilisateur bloqué est l'utilisateur courant
                const blockUserButton = document.getElementById(receivedMessage.blocker).querySelector('.block-button')
                blockUserButton.style.display = 'none';
            } else if (receivedMessage.blocked !== receivedMessage.user) {
                // Si l'utilisateur bloqué est l'autre utilisateur
                const blockUserButton = document.getElementById(receivedMessage.blocked).querySelector('.block-button')
                blockUserButton.style.color = 'green';
                blockUserButton.style.display = 'block';
            }
        } else if (receivedMessage.type === 'user_unblocked') {
            enableChat(receivedMessage);
            if (receivedMessage.blocked === receivedMessage.user) {
                const blockUserButton = document.getElementById(receivedMessage.blocker).querySelector('.block-button')
                blockUserButton.style.color = 'red';
                blockUserButton.style.display = 'block';
            } else if (receivedMessage.blocked !== receivedMessage.user) {
                // Si l'utilisateur bloqué est l'autre utilisateur
                const blockUserButton = document.getElementById(receivedMessage.blocked).querySelector('.block-button')
                blockUserButton.style.color = 'red';
                blockUserButton.style.display = 'block';

            }
        }
    }

    chatWS.onclose = function() {
        if (DEBUG) {console.log('WebSocket CLOSE - conversationID:', conversationID);}
    }

    chatWS.onerror = function(event) {
        if (DEBUG) {console.error('WebSocket ERROR:', event);}
    }
}

//                  BLOCK/UNBLOCK USER FUNCTIONALITIES                  //

// Function to block/unblock a user
function blockUnblockUser(user) {
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

function enableChat() {
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.querySelector('.chat-send-button');
    const inviteGameButton = document.querySelector('.invite-game-button');

    if (chatInput && chatSendButton) {
        chatInput.disabled = false;
        chatSendButton.disabled = false;
        inviteGameButton.disabled = false;
    }
}

//                  BLOCK/UNBLOCK USER FUNCTIONALITIES                  //
