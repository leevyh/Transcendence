import wsManager  from './wsManager.js';
import { getCookie } from './utils.js';
import { DEBUG } from '../app.js';
import { navigationBar } from './navigation.js';
import { notifications } from './notifications.js';

function sendFriendRequest(nickname) {
    sendFriendRequestToServer(nickname).then(r => {
        if (DEBUG) {console.log('Friend request sent');}
    })
    .catch(error => {
        if (DEBUG) {console.error('Friend request failed', error);}
    });
}

async function sendFriendRequestToServer(nickname) {
    if (wsManager.socket.readyState === WebSocket.OPEN) {
        wsManager.send({
            type: 'friend_request',
            nickname: nickname,
        });
    } else {
        if (DEBUG) {console.log("Websocket is not open friend request cannot be sent");}
    }
}

function createUserRow(user_list_row, data) {
    // Utiliser user_id pour l'ID de la carte utilisateur
    let user_card_id = `user_card_${data.user_id}`;
    let user_card_element = document.getElementById(user_card_id);
    
    if (!user_card_element) {
        console.log('data', data);
        const user_col = document.createElement('div');
        user_col.className = 'col-xl-4 col-md-6';
        user_list_row.appendChild(user_col);
        
        const user_card = document.createElement('div');
        user_card.className = `user_card card special_card_${Math.floor(Math.random() * 12)}`;
        user_card.id = user_card_id;  // Utiliser user_id pour l'ID
        user_col.appendChild(user_card);

        const background_color = document.createElement('div');
        background_color.className = 'user_card_background w-100 ratio ratio-4x1 z-0';
        background_color.style = `background-color: rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)});`;
        user_card.appendChild(background_color);

        const user_card_info = document.createElement('div');
        user_card_info.className = 'user_card_info card-body z-1';
        user_card.appendChild(user_card_info);

        const user_avatar = document.createElement('img');
        user_avatar.className = 'profile_photo_lg';
        user_avatar.src = `data:image/png;base64,${data.avatar}`;
        user_avatar.alt = 'User avatar';
        user_card_info.appendChild(user_avatar);

        const user_global_info = document.createElement('div');
        user_global_info.className = 'user_info d-flex justify-content-between align-items-baseline';
        user_card_info.appendChild(user_global_info);

        const user_info_name_status = document.createElement('div');
        user_info_name_status.className = 'd-flex flex-column';
        user_global_info.appendChild(user_info_name_status);

        const user_name = document.createElement('h5');
        user_name.className = 'mb-0';
        user_info_name_status.appendChild(user_name);

        const user_name_span = document.createElement('span');
        user_name_span.textContent = data.nickname;
        user_name_span.className = 'user_nickname';
        user_name.appendChild(user_name_span);

        const user_status = document.createElement('span');
        user_status.className = 'mt-2 mb-0 user_status';
        user_status.textContent = data.status;
        user_info_name_status.appendChild(user_status);

        const friends_button = document.createElement('button');
        user_global_info.appendChild(friends_button);
        friends_button.className = 'btn btn-sm btn-primary';
        friends_button.textContent = 'Add friend';
        friends_button.addEventListener('click', (event) => {
            sendFriendRequest(data.nickname);
        });
    }

    // Mettre à jour le statut de l'utilisateur
    const userStatus = document.querySelector(`#${user_card_id} .user_status`);
    userStatus.textContent = data.status;

    // Mettre à jour l'avatar de l'utilisateur
    const userAvatar = document.querySelector(`#${user_card_id} .profile_photo_lg`);
    userAvatar.src = `data:image/png;base64,${data.avatar}`;

    // Mettre à jour le pseudo de l'utilisateur
    const userNickname = document.querySelector(`#${user_card_id} .user_nickname`);
    userNickname.textContent = data.nickname;
}

export async function friendsView(container) {
    container.innerHTML = '';

    const token = localStorage.getItem('token');
    console.log(token);

    const url = window.location.href.split('/').pop();

    const statusSocket = new WebSocket('ws://' + window.location.host + '/ws/status/');
    statusSocket.onopen = function (event) {
        if (DEBUG) {console.log('Status socket opened');}
    }

    statusSocket.onmessage = function (event) {
        if (DEBUG) {console.log('Message received:', event.data);}
        const data = JSON.parse(event.data);
        const user_list_row = document.querySelector('.user_list_row');
        createUserRow(user_list_row, data);
    };

    statusSocket.onclose = function (event) {
        if (DEBUG) {console.error('Status socket closed', event);}
    }

    container.innerHTML = '';

    const global_div = document.createElement('div');
    global_div.className= 'd-flex justify-content-start align-item-center w-100 h-100';
    container.appendChild(global_div);

    const nav = await navigationBar(container);
    global_div.appendChild(nav);

    const user_list = document.createElement('div');
    user_list.className = 'user_list container-fluid';

    const user_list_row = document.createElement('div');
    user_list_row.className = 'row p-4 user_list_row';

    user_list.appendChild(user_list_row);
    global_div.appendChild(user_list);

    fetch('/api/users/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => response.json())
    .then(data => { // FIXME: if it's about me, don't display me
        data.forEach(user => {
            createUserRow(user_list_row, user);
        });
    });

    const notifications_div = await notifications();
    global_div.appendChild(notifications_div);
}
