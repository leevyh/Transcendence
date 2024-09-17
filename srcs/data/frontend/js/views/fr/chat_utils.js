export let ws = null;

// Function to display a message in the chat
function displayMessage(messageData) {
    const chatBody = document.querySelector('.chat-body');
    const messageElement = document.createElement('div');
    const imgAvatar = document.createElement('img');
    imgAvatar.className = 'avatar';
    const messageDiv = document.createElement('div');
    const messageContent = document.createElement('p');
    messageContent.className = 'message-content';

    if (messageData.sender.username === messageData.user) { // Means that the sender is the user
        messageElement.className = 'message sent-message';
        const Avatar = messageData.sender.avatar;
        imgAvatar.alt = 'Your avatar';
        imgAvatar.src = `data:image/png;base64, ${Avatar}`;
        messageDiv.className = 'message-div';
        messageContent.innerHTML = `
            <strong>${messageData.sender.username}:</strong> ${messageData.message} <br>
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
            <strong>${messageData.sender.username}:</strong> ${messageData.message} <br>
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

    ws = new WebSocket(`ws://localhost:8888/ws/${conversationID}/messages/`);

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
        }
    }

    ws.onclose = function() {
        // console.log('WebSocket connection closed');         // DEBUG
    }

    ws.onerror = function(event) {
        console.error('WebSocket error:', event);         // DEBUG
    }
}
