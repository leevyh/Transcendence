//TODO REMOVE THIS
import { isAuthenticated } from './utils.js';
import { getCookie } from './utils.js';
import wsManager  from './wsManager.js';
import { navigationBar } from './fr/navigation.js';
import { DEBUG } from '../app.js';

export async function friendsView(container) {
    container.innerHTML = '';
    navigationBar(container); // Add navigation bar

    const url = window.location.href.split('/').pop();

    const statusSocket = new WebSocket('ws://' + window.location.host + '/ws/status/');

    statusSocket.onopen = function (event) {
        if (DEBUG) {console.log('Status socket opened');}
    }

    statusSocket.onmessage = function (event) {
        if (DEBUG) {console.log('Message received:', event.data);}
        const data = JSON.parse(event.data);
        //Update status of user in the card
        //Get the card with the nickname
        const userCard = document.getElementById(data.nickname);
        //Get the status paragraph
        const userStatus = userCard.querySelector('.card-text');
        //Update the status
        userStatus.textContent = `${data.status}`;
        //Update the dot color
    };

    statusSocket.onclose = function (event) {
        if (DEBUG) {console.error('Status socket closed', event);}
    }


    // const isAuth = await isAuthenticated();
    const token = localStorage.getItem('token');
    // if (isAuth) {
        // container.appendChild(buttonSettings);
        // container.appendChild(logoutButton);
        //TEMPORAIRE FRIENDS SYSTEM

        //GET ALL USERS
    fetch('/api/users/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => response.json())
    .then(data => {
        //Display card with user info (Nickname, avatar, status (onffline = Red dot, online = Green dot))
        data.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'card';
            userCard.style = 'width: 50%;';
            //Create card with id = user.nickname
            userCard.id = user.nickname;

            const userAvatar = document.createElement('img');
            userAvatar.src = `data:image/png;base64,${user.avatar}`;
            userAvatar.className = 'card-img-top';
            userAvatar.style = 'width: 100px; height: 100px;';
            userAvatar.alt = 'User avatar';

            const userCardBody = document.createElement('div');
            userCardBody.className = 'card-body';

            const userNickname = document.createElement('h5');
            userNickname.className = 'card-title';
            userNickname.textContent = user.nickname;

            //Put this dot behind the status text
            const userStatus = document.createElement('p');
            userStatus.className = 'card-text';
            userStatus.setAttribute('data-nickname', user.nickname);
            userStatus.style = 'display: flex; align-items: center;';
            userStatus.textContent = `${user.status}`;

            const friendRequestButton = document.createElement('button');
            friendRequestButton.className = 'btn btn-primary';
            friendRequestButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">\n' +
                '  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>\n' +
                '  <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>\n' +
                '</svg>';
            friendRequestButton.addEventListener('click', (event) => {
                sendFriendRequest(user.nickname);
            });
            userCardBody.appendChild(userNickname);
            userCardBody.appendChild(userStatus);
            userCardBody.appendChild(friendRequestButton);
            userCard.appendChild(userAvatar);
            userCard.appendChild(userCardBody);
            container.appendChild(userCard);
        });
    })

    function sendFriendRequest(nickname) {
        sendFriendRequestToServer(nickname);
    }

    // async function checkFriendAsBeenRequested(nickname) {
    //     const token = localStorage.getItem('token');
    //     const response = await fetch('/api/get_friend_request/' + nickname, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': getCookie('csrftoken'),
    //         },
    //     });
    //     const data = await response.json();
    //     // console.log(data);         // DEBUG
    //     return data.status;
    // }

    async function sendFriendRequestToServer(nickname) {
        if (wsManager.socket.readyState === WebSocket.OPEN) {
            wsManager.send({
                type: 'friend_request',
                nickname: nickname,
                url: url,
            });
        } else {
            if (DEBUG) {console.log("Websocket is not open friend request cannot be sent");}
        }
    }
}