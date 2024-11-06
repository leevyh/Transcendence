import { getCookie } from './utils.js';
import { DEBUG } from '../app.js';
import { navigationBar } from './navigation.js';
import { createGlobalContainer, createUserCard } from '../components/chat/visual.js';
import { notifications } from "./notifications.js";

export let statusChatSocket = null;

export async function chatView(container) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navBarContainer = await navigationBar(container);
    div.appendChild(navBarContainer);

    const viewContainer = await createGlobalContainer();
    div.appendChild(viewContainer);

    // Create the WebSocket for user status

     if (statusChatSocket === null) {
        statusChatSocket = new WebSocket(`wss://${window.location.host}/ws/status/`);
        statusChatSocket.onopen = function (event) {
            if (DEBUG) {
                console.log('Status WebSocket opened (in Chat)');
            }
        }
    }
    else if (statusChatSocket.readyState === WebSocket.CLOSED) {
        statusChatSocket = new WebSocket(`wss://${window.location.host}/ws/status/`);
        statusChatSocket.onopen = function (event) {
            if (DEBUG) {console.log('Status WebSocket opened (in Chat)');}
        }
    }

    // Onopen event
    statusChatSocket.onopen = function(event) {
        if (DEBUG) {console.log('Status WebSocket opened (in Chat)');}
    };

    // On message received from the server (status of a user)
    statusChatSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        // Update the user list with the new status
        const userList = document.getElementById('user-list');
        if (userList) {
            if (DEBUG) {console.log('Creating user card via socket');}
            createUserCard(data, userList);
        }
    };

    // Onclose event
    statusChatSocket.onclose = function(event) {
        if (DEBUG) {console.error('Status WebSocket closed (in Chat)', event);}
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
            if (DEBUG) {console.log('Creating user card via call API');}
            createUserCard(user, userList);
        });
    })
    .catch(error => {
        if (DEBUG) {console.error('Error:', error);}
    });

    const notification_div = await notifications(container);
    div.appendChild(notification_div);
}
