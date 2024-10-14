import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { createNavigationBar } from '../components/navigationBar/visual.js';

function displayFriends(friends) {
    console.log(friends);
    const divListFriends = document.querySelector('.divListFriends');
    divListFriends.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'list-unstyled d-flex flex-column friends_ul';

    // Sort friends by status and if all are offline or online, sort by nickname

    // friends.sort((a, b) => {
    //     if (a.status === b.status) {
    //         return a.nickname.localeCompare(b.nickname); TODO : CHECK IF IT WORKS
    //     }
    //     return a.status.localeCompare(b.status);
    // });

    friends = friends.sort((a, b) => {
        if (a.status === 'online' && b.status !== 'online') {
            return -1;
        } else if (a.status !== 'online' && b.status === 'online') {
            return 1;
        } else {
            return 0;
        }
    });

    divListFriends.appendChild(ul);
    friends.forEach(friend => {
        const li = document.createElement('li');
        li.className = 'friendItem';
        const cardFriend = document.createElement('div');
        cardFriend.className = 'card d-flex flex-row align-items-center p-2 shadow-sm';

        const avatarFriend = document.createElement('img');
        avatarFriend.src = `data:image/png;base64, ${friend.avatar}`;
        avatarFriend.className = 'avatarFriend rounded-circle';
        avatarFriend.alt = 'Friend Avatar';
        cardFriend.appendChild(avatarFriend);

        const infoFriend = document.createElement('div');
        infoFriend.className = 'ms-3';

        const nicknameFriend = document.createElement('span');
        nicknameFriend.className = 'friend-name mb-1';
        nicknameFriend.textContent = friend.nickname;
        infoFriend.appendChild(nicknameFriend);

        const statusFriend = document.createElement('small');
        statusFriend.className = 'friends_status';
        statusFriend.textContent = friend.status;
        infoFriend.appendChild(statusFriend);

        cardFriend.appendChild(infoFriend);
        li.appendChild(cardFriend);
        ul.appendChild(li);
    });
}

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
            console.log('WebSocket connection established');
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
            console.error('WebSocket connection closed.');
        };

        // On WebSocket error
        friends_websocket.onerror = error => {
            console.error('WebSocket error:', error);
        };


                // Creation of the navigation bar
                const nav = await createNavigationBar(container, userData);
                div.appendChild(nav);
            } else {
                console.error('No data received');
            }
        } else if (response.status === 307) {
            // Si redirection nécessaire, déconnectez l'utilisateur
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