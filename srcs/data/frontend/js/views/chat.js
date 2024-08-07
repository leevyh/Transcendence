// export function chatView(container) {
//     // Clear previous content
//     container.innerHTML = '';

//     // Create elements
//     const chatContainer = document.createElement('div');
//     chatContainer.classList.add('chat-container');

//     // channels container
//     const channelsContainer = document.createElement('div');
//     channelsContainer.classList.add('channels-container');
//     const channelsTitle = document.createElement('h2');
//     channelsTitle.textContent = 'Channels';
//     const channelsList = document.createElement('ul');
//     channelsContainer.appendChild(channelsTitle);
//     channelsContainer.appendChild(channelsList);

//     // users container
//     const usersContainer = document.createElement('div');
//     usersContainer.classList.add('users-container');
//     const usersTitle = document.createElement('h2');
//     usersTitle.textContent = 'Online Users';
//     const usersList = document.createElement('ul');
//     usersContainer.appendChild(usersTitle);
//     usersContainer.appendChild(usersList);

//     const chatArea = document.createElement('div');
//     chatArea.classList.add('chat-area');

//     // channel creation container
//     const createChannelContainer = document.createElement('div');
//     createChannelContainer.classList.add('create-channel-container');
//     const channelInput = document.createElement('input');
//     channelInput.setAttribute('type', 'text');
//     channelInput.setAttribute('placeholder', 'New channel name');
//     const createChannelButton = document.createElement('button');
//     createChannelButton.textContent = 'Create Channel';
//     createChannelContainer.appendChild(channelInput);
//     createChannelContainer.appendChild(createChannelButton);

//     // chatContainer.appendChild(channelsContainer);
//     chatContainer.appendChild(usersContainer);
//     chatContainer.appendChild(chatArea);
//     // chatContainer.appendChild(createChannelContainer);

//     // Append chat container to main container
//     container.appendChild(chatContainer);

//     // Load initial data
//     // loadChannels();
//     loadUsers();

//     // Event listener for creating a channel
//     createChannelButton.addEventListener('click', async () => {
//         const channelName = channelInput.value.trim();
//         if (channelName) {
//             try {
//                 const response = await fetch('/api/channels/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ name: channelName }),
//                 });
//                 if (response.ok) {
//                     channelInput.value = '';
//                     loadChannels();
//                 } else {
//                     console.error('Failed to create channel');
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         }
//     });

//     // Function to load channels
//     async function loadChannels() {
//         try {
//             const response = await fetch('/api/channels/');
//             if (response.ok) {
//                 const channels = await response.json();
//                 channelsList.innerHTML = '';
//                 channels.forEach(channel => {
//                     const channelItem = document.createElement('li');
//                     channelItem.textContent = channel.name;
//                     channelItem.addEventListener('click', () => joinChannel(channel.name));
//                     channelsList.appendChild(channelItem);
//                 });
//             } else {
//                 console.error('Failed to load channels');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }

//     // Function to load users
//     async function loadUsers() {
//         try {
//             const response = await fetch('/api/users/'); // api/profile/<str:nickname>' ?? Comment recuperer TOUS les users en ligne ?
//             if (response.ok) {
//                 const users = await response.json();
//                 usersList.innerHTML = '';
//                 users.forEach(user => {
//                     const userItem = document.createElement('li');
//                     userItem.textContent = user.username;
//                     usersList.appendChild(userItem);
//                 });
//             } else {
//                 console.error('Failed to load users');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }

//     // Function to join a channel
//     function joinChannel(channelName) {
//         chatArea.innerHTML = '';
//         const channelTitle = document.createElement('h3');
//         channelTitle.textContent = `Channel: ${channelName}`;
//         chatArea.appendChild(channelTitle);

//         const messagesContainer = document.createElement('div');
//         messagesContainer.classList.add('messages-container');
//         chatArea.appendChild(messagesContainer);

//         const inputContainer = document.createElement('div');
//         inputContainer.classList.add('input-container');
//         const messageInput = document.createElement('input');
//         messageInput.setAttribute('type', 'text');
//         messageInput.setAttribute('placeholder', 'Type your message...');
//         const sendButton = document.createElement('button');
//         sendButton.textContent = 'Send';
//         inputContainer.appendChild(messageInput);
//         inputContainer.appendChild(sendButton);
//         chatArea.appendChild(inputContainer);

//         // Load messages for the channel
//         loadMessages(channelName, messagesContainer);

//         // Event listener for sending messages
//         sendButton.addEventListener('click', async () => {
//             const message = messageInput.value;
//             if (message.trim()) {
//                 try {
//                     const response = await fetch(`/api/channels/${channelName}/messages/`, {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({ content: message }),
//                     });
//                     if (response.ok) {
//                         messageInput.value = '';
//                         loadMessages(channelName, messagesContainer);
//                     } else {
//                         console.error('Failed to send message');
//                     }
//                 } catch (error) {
//                     console.error('Error:', error);
//                 }
//             }
//         });
//     }

//     // Function to load messages
//     async function loadMessages(channelName, messagesContainer) {
//         try {
//             const response = await fetch(`/api/channels/${channelName}/messages/`);
//             if (response.ok) {
//                 const messages = await response.json();
//                 messagesContainer.innerHTML = '';
//                 messages.forEach(msg => {
//                     const messageDiv = document.createElement('div');
//                     messageDiv.textContent = msg.content;
//                     messagesContainer.appendChild(messageDiv);
//                 });
//             } else {
//                 console.error('Failed to load messages');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }
// }


{/* <head>
    <title>django-channel-chat</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js "></script>
    <style>
        #roomSelect {
            height: 300px;
        }
    </style>
</head>
<body>
    <div class="container mt-3 p-5">
        <h2>django-channel-chat</h2>
        <div class="row">
            <div class="col-12 col-md-8">
                <div class="mb-2">
                    <label for="roomInput">Enter a room name to connect to it:</label>
                    <input type="text" id="roomInput" class="form-control" placeholder="Room name">
                    <small id="roomInputHelp" class="form-text text-muted">If the room doesn't exist yet, it will be created for you.</small>
                </div>
                <button type="button" id="roomConnect" class="btn btn-success">Connect</button>
            </div>
            <div class="col-12 col-md-4">
                <label for="roomSelect">Active rooms:</label>
                <select multiple class="form-control" id="roomSelect">
                    {% for room in rooms %}
                    <option>{{ room }}</option>
                    {% endfor %}
                </select>
            </div>
        </div>
    </div>
</body> */}


// views/chat.js
export function chatView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create the main container
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('container', 'mt-3', 'p-5');

    // Create the title
    const title = document.createElement('h2');
    title.textContent = 'Welcome to the chat!';

    // Create the row
    const row = document.createElement('div');
    row.classList.add('row');

    // Create the online users section
    const onlineUsersSection = document.createElement('div');
    onlineUsersSection.classList.add('mt-4');

    const onlineUsersLabel = document.createElement('h4');
    onlineUsersLabel.textContent = 'Users:';

    const onlineUsersList = document.createElement('ul');
    onlineUsersList.setAttribute('id', 'onlineUsersList');
    onlineUsersList.classList.add('list-group');

    onlineUsersSection.appendChild(onlineUsersLabel);
    onlineUsersSection.appendChild(onlineUsersList);

    // Append online users section to the row
    row.appendChild(onlineUsersSection);

    // Append title and row to the main container
    mainContainer.appendChild(title);
    mainContainer.appendChild(row);

    // Append the main container to the provided container
    container.appendChild(mainContainer);

    // Fetch and display online users
    function fetchOnlineUsers() {
        fetch('api/status_user/')
            .then(response => response.json())
            .then(users => {
                onlineUsersList.innerHTML = '';
                users.forEach(user => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.textContent = user.nickname + ' - ' + user.status;
                    onlineUsersList.appendChild(listItem);
                });


            })
            .catch(error => console.error('Error fetching online users:', error));
    }

    // Initial fetch of online users
    fetchOnlineUsers();

    // Refresh the list of online users every 10 seconds
    setInterval(fetchOnlineUsers, 10000);
}

