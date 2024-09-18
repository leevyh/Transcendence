import { navigationBar } from './navigation.js';
import { getCookie } from '../utils.js';
import { handleMessage, openConversation } from './chat_utils.js';

export async function chatView(container) {
    container.innerHTML = '';
    navigationBar(container); // Add navigation bar

    const globalContainer = await createGlobalContainer();
    container.appendChild(globalContainer);

    // Create the WebSocket for user status
    const statusSocket = new WebSocket('ws://' + window.location.host + '/ws/status/');

    // Onopen event
    statusSocket.onopen = function(event) {
        // console.log('Status socket opened');          // DEBUG
    };

    // On message received from the server (status of a user)
    statusSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        // Update the user list with the new status
        const userList = document.getElementById('user-list');
        createUserCard(data, userList);
    };

    // Onclose event
    statusSocket.onclose = function(event) {
        console.error('Status socket closed', event);         // DEBUG
    };

    const userList = document.getElementById('user-list');

    // Call API to get the list of users
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
        // For each user, create a user card
        data.forEach(user => {
            createUserCard(user, userList);
        });
    })
    .catch(error => console.error('Error:', error));

}

async function createGlobalContainer() {
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

function createUserCard(user, userList) {
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
        userCardBody.appendChild(dot);
        userCardBody.appendChild(userNickname);
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

function createChatHeaderButtons() {
    // Create a div for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    const inviteGameButton = document.createElement('button');
    inviteGameButton.className = 'btn btn-primary';
    inviteGameButton.textContent = 'Invite to Game';
    inviteGameButton.addEventListener('click', (event) => {
        console.log('User invited to play Pong (TODO)');
        // TODO: Implement invite to game
    });

    // Add a button to see the user profile
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

    // Créer l'élément path et ajouter ses attributs
    const pathUP = document.createElementNS(svgUPlink, "path");
    pathUP.setAttribute("d", "M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z");

    // Ajouter le path à l'élément SVG
    svgUP.appendChild(pathUP);
    viewProfileButton.appendChild(svgUP);

    // Add a button to block the user
    const blockUserButton = document.createElement('button');
    blockUserButton.className = 'btn btn-danger';
    // blockUserButton.textContent = 'Block User';
    blockUserButton.addEventListener('click', (event) => {
        console.log('User blocked (TODO)');
        // TODO: Implement block user functionality
    });

    // Add an icon in the blockUserButton
    const svgBUlink = "http://www.w3.org/2000/svg";
    const svgBU = document.createElementNS(svgBUlink, "svg");
    svgBU.setAttribute("xmlns", svgBUlink);
    svgBU.setAttribute("width", "16");
    svgBU.setAttribute("height", "16");
    svgBU.setAttribute("fill", "currentColor");
    svgBU.setAttribute("class", "bi bi-ban");
    svgBU.setAttribute("viewBox", "0 0 16 16");
    
    // Créer l'élément path et ajouter ses attributs
    const pathBU = document.createElementNS(svgBUlink, "path");
    pathBU.setAttribute("d", "M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0");

    // Append the path to the svg
    svgBU.appendChild(pathBU);
    blockUserButton.appendChild(svgBU);

    buttonContainer.appendChild(viewProfileButton);
    buttonContainer.appendChild(blockUserButton);
    buttonContainer.appendChild(inviteGameButton);

    return buttonContainer;
}

function openChat(user) {
    const chatTitle = document.querySelector('.chat-title');
    chatTitle.textContent = `Chat with ${user}`; // TODO: Add username and link to profile

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