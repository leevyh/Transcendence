import { getCookie } from '../utils.js';
import { createGlobalContainer, createUserCard } from './chat_utils.js';
import { DEBUG } from '../../app.js';
import { navBar } from './nav.js';

export async function chatView(container) {
    container.innerHTML = '';

    // Creation big div for the chat and the navigation bar
    const div = document.createElement('div');
    div.className= 'big-div';
    container.appendChild(div);

    const nav = navBar(container);
    div.appendChild(nav);

    const globalContainer = await createGlobalContainer();
    div.appendChild(globalContainer);

    // Create the WebSocket for user status
    const statusSocket = new WebSocket('wss://' + window.location.host + '/wss/status/');

    // Onopen event
    statusSocket.onopen = function(event) {
        if (DEBUG) {console.log('Status socket opened');}
    };

    // On message received from the server (status of a user)
    statusSocket.onmessage = function(event) {
        // FIXME: Handle the message properly, if I'm the one who sent the message, don't send an error
        const data = JSON.parse(event.data);
        if (DEBUG) {console.log('Message received:', data);}
        // Update the user list with the new status
        const userList = document.getElementById('user-list');
        createUserCard(data, userList);
    };

    // Onclose event
    statusSocket.onclose = function(event) {
        if (DEBUG) {console.error('Status socket closed', event);}
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
    .catch(error => {
        if (DEBUG) {console.error('Error:', error);}
    });
}