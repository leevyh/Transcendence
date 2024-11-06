import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { createNavigationBar } from '../components/navigationBar/visual.js';
import { displayFriends, updateFriendStatus, addNewFriend } from '../components/navigationBar/friends.js';


export let friends_websocket = null;

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
                    avatar: data.avatar,
                };

                console.log("friends_websocket", friends_websocket);
                if (friends_websocket === null) {
                    friends_websocket = new WebSocket(`wss://${window.location.host}/ws/friends/`);
                    friends_websocket.onopen = function (event) {
                        if (DEBUG) {console.log('Status WebSocket opened (in Navigation)');}
                        friends_websocket.send(JSON.stringify({type: 'get_friends'}));

                    }
                }
                else if (friends_websocket.readyState === WebSocket.CLOSED) {
                    friends_websocket = new WebSocket(`wss://${window.location.host}/ws/friends/`);
                    friends_websocket.onopen = function (event) {
                        if (DEBUG) {console.log('Status WebSocket opened (in Navigation)');}
                        friends_websocket.send(JSON.stringify({type: 'get_friends'}));
                    }
                }
                else  if (friends_websocket.readyState === WebSocket.OPEN) {
                        friends_websocket.send(JSON.stringify({type: 'get_friends'}));
                }


                friends_websocket.onmessage = event => {
                    const message = JSON.parse(event.data);
                    console.log('Friends:', message);

                    if (message.type === 'get_friends') {
                        displayFriends(message.friends);
                    } else if (message.type === 'friends_status_update') {
                        updateFriendStatus(message.user_id, message.nickname, message.status);
                    } else if (message.type === 'new_friend_added') {
                        addNewFriend(message.user_id, message.nickname, message.status, message.avatar);
                    }
                };

                friends_websocket.onclose = () => {
                    if (DEBUG) console.error('Friends WebSocket connection closed.');
                };

                // On WebSocket error
                friends_websocket.onerror = error => {
                    if (DEBUG) console.error('Friends WebSocket error:', error);
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
