import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { createNavigationBar } from '../components/navigationBar/visual.js';
import { displayFriends } from '../components/navigationBar/friends.js';

export async function navigationBar(container) {
    const div = document.createElement('div');
    div.className = 'navigationBarDiv h-100 d-flex flex-column text-white';

    try {
        // Get user data from backend
        const response = await fetch(`/api/settings/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        if (response.status === 200) {
            const data = await response.json();

            if (data) {
                const userData = {
                    username: data.username,
                    nickname: data.nickname,
                    email: data.email,
                    language: data.language,
                    font_size: data.font_size,
                    theme: data.dark_mode,
                    avatar: data.avatar,
                };

                const friends_websocket = new WebSocket(`ws://${window.location.host}/ws/friends/`);
                friends_websocket.onopen = () => {
                    if (DEBUG) console.log('WebSocket connection established');
                    friends_websocket.send(JSON.stringify({ type: 'get_friends' }));
                }

                friends_websocket.onmessage = event => {
                    const message = JSON.parse(event.data);
                    if (message.type === 'get_friends') {
                        // Display the list of friends
                        displayFriends(message.friends);
                    }
                };

                friends_websocket.onclose = () => {
                    if (DEBUG) console.error('WebSocket connection closed.');
                };

                // On WebSocket error
                friends_websocket.onerror = error => {
                    if (DEBUG) console.error('WebSocket error:', error);
                };

                // Creation of the navigation bar
                const nav = await createNavigationBar(container, userData);
                div.appendChild(nav);

            } else {
                console.error('No data received');
            }
        } else if (response.status === 307) {
            localStorage.removeItem('token');
            await fetch('/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });
            navigateTo('/');
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }

    return div;
}

function createNavButton(text, onClick) {
    const listItem = document.createElement('li');
    listItem.className = 'ElemListNavBar text-center py-2';

    const button = document.createElement('button');
    button.className = 'btn text-primary';
    button.textContent = text;

    // Remove the outline when the button loses focus
    button.addEventListener('blur', () => {
        button.style.outline = 'none';
    });

    listItem.appendChild(button);

    button.addEventListener('click', () => {
        if (DEBUG) {
            console.log(`Navigating to ${text}`, 'actual:', window.location.pathname);
        }

        // Check if the text is "pong" and redirect to "/menuPong"
        const targetPath = text.toLowerCase() === 'pong' ? '/menuPong' : `/${text.toLowerCase()}`;

        if (window.location.pathname === targetPath) {
            return;
        }

        onClick();
    });

    return listItem;
}
