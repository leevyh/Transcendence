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
        //Update status of user in the card
        //Get the card with the nickname
        // const userCard = document.getElementById(data.nickname);
        // //Get the status paragraph
        // const userStatus = userCard.querySelector('.card-text');
        // //Update the status
        // userStatus.textContent = `${data.status}`;
        const user_list_row = document.querySelector('.user_list_row');
        createUserRow(user_list_row, data);
        //Update the dot color
    };

    statusSocket.onclose = function (event) {
        if (DEBUG) {console.error('Status socket closed', event);}
    }


    container.innerHTML = '';
    // navigationBar(container); // Add navigation bar Old version

    const global_div = document.createElement('div');
    global_div.className= 'd-flex justify-content-start align-item-center w-100 h-100';
    container.appendChild(global_div);

    const nav = navigationBar(container);
    global_div.appendChild(nav);

    const user_list = document.createElement('div');
    user_list.className = 'user_list container-fluid';

    const user_list_row = document.createElement('div');
    user_list_row.className = 'row p-4 user_list_row';




    //Get all users with websocket status and display them (if new user inside a database, add it to the list)

    user_list.appendChild(user_list_row);
    global_div.appendChild(user_list);

    // const isAuth = await isAuthenticated();





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
        data.forEach(user => {
            createUserRow(user_list_row, user);
        });

    });


        //     //Display card with user info (Nickname, avatar, status (onffline = Red dot, online = Green dot))
    //     data.forEach(user => {
    //         const userCard = document.createElement('div');
    //         userCard.className = 'card';
    //         userCard.style = 'width: 50%;';
    //         //Create card with id = user.nickname
    //         userCard.id = user.nickname;
    //
    //         const userAvatar = document.createElement('img');
    //         userAvatar.src = `data:image/png;base64,${user.avatar}`;
    //         userAvatar.className = 'card-img-top';
    //         userAvatar.style = 'width: 100px; height: 100px;';
    //         userAvatar.alt = 'User avatar';
    //
    //         const userCardBody = document.createElement('div');
    //         userCardBody.className = 'card-body';
    //
    //         const userNickname = document.createElement('h5');
    //         userNickname.className = 'card-title';
    //         userNickname.textContent = user.nickname;
    //
    //         //Put this dot behind the status text
    //         const userStatus = document.createElement('p');
    //         userStatus.className = 'card-text';
    //         userStatus.setAttribute('data-nickname', user.nickname);
    //         userStatus.style = 'display: flex; align-items: center;';
    //         userStatus.textContent = `${user.status}`;
    //
    //         const friendRequestButton = document.createElement('button');
    //         friendRequestButton.className = 'btn btn-primary';
    //         friendRequestButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">\n' +
    //             '  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>\n' +
    //             '  <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>\n' +
    //             '</svg>';
    //         friendRequestButton.addEventListener('click', (event) => {
    //             sendFriendRequest(user.nickname);
    //         });
    //         userCardBody.appendChild(userNickname);
    //         userCardBody.appendChild(userStatus);
    //         userCardBody.appendChild(friendRequestButton);
    //         userCard.appendChild(userAvatar);
    //         userCard.appendChild(userCardBody);
    //         container.appendChild(userCard);
    //     });
    // }

    const notifications_div = await notifications();
    global_div.appendChild(notifications_div);
}
