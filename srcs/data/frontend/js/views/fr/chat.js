import { getCookie } from '../utils.js';
import { navigationBar } from './navigation.js';
import { createGlobalContainer, createUserCard } from './chat_utils.js';

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
        // FIXME: Handle the message properly, if I'm the one who sent the message, don't send an error
        const data = JSON.parse(event.data);
        console.log('Message received:', data);          // DEBUG
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