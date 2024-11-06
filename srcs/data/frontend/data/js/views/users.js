import wsManager  from './wsManager.js';
import { getCookie } from './utils.js';
import { DEBUG, navigateTo, getCurrentUser } from '../app.js';
import { navigationBar } from './navigation.js';
import { notifications } from './notifications.js';

export let statusSocket = null;

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
        if (DEBUG) {console.log("Friends Websocket is not open, friend request cannot be sent");}
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

        // Add a container for the buttons
        const user_buttons = document.createElement('div');
        user_buttons.className = 'd-flex flex-row';
        user_global_info.appendChild(user_buttons);

        const friends_button = document.createElement('button');
        friends_button.className = 'btn btn-sm btn-primary';
        friends_button.textContent = 'Add friend';
        friends_button.setAttribute('aria-label', `Add ${data.nickname} as a friend`);
        user_buttons.appendChild(friends_button);
        friends_button.addEventListener('click', () => {
            sendFriendRequest(data.nickname);
        });

        // Add a button to see the user's profile
        const profile_button = document.createElement('button');
        profile_button.className = 'btn btn-sm btn-light bi-person-lines-fill';
        profile_button.setAttribute('aria-label', `View ${data.nickname}'s profile`);
        user_buttons.appendChild(profile_button);
        profile_button.addEventListener('click', () => {
            // Redirect to the profile page of the user
            navigateTo(`/profile/${data.user_id}`);
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

    const me = await getCurrentUser(); // Current user

    const token = localStorage.getItem('token');
    console.log(token);

    // const url = window.location.href.split('/').pop();

     if (statusSocket === null) {
        statusSocket = new WebSocket(`wss://${window.location.host}/ws/status/`);
        statusSocket.onopen = function (event) {
            if (DEBUG) {
                console.log('Status WebSocket opened (in Users)');
            }
        }
    }
     else if (statusSocket.readyState === WebSocket.CLOSED) {
        statusSocket = new WebSocket(`wss://${window.location.host}/ws/status/`);
        statusSocket.onopen = function (event) {
            if (DEBUG) {console.log('Status WebSocket opened (in Users)');}
        }
    }

    statusSocket.onmessage = function (event) {
        if (DEBUG) {console.log('Message received:', event.data);}
        const data = JSON.parse(event.data);
        if (data.user_id !== me.id) {
            const user_list_row = document.querySelector('.user_list_row');
            createUserRow(user_list_row, data);
        }
    };

    statusSocket.onclose = function (event) {
        if (DEBUG) {console.error('Status WebSocket closed (in Users)', event);}
    }

    container.innerHTML = '';

    const global_div = document.createElement('div');
    global_div.className= 'd-flex justify-content-start align-item-center w-100 h-100';
    container.appendChild(global_div);

    const nav = await navigationBar(container);
    global_div.appendChild(nav);

    const user_list = document.createElement('div');
    user_list.className = 'user_list container-fluid';
    global_div.appendChild(user_list);

    // Add a search bar to search for users
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group p-2';
    user_list.appendChild(inputGroup);

    const inputGroupPrepend = document.createElement('div');
    inputGroupPrepend.className = 'input-group-prepend';
    inputGroup.appendChild(inputGroupPrepend);
    
    const searchIcon = document.createElement('span');
    searchIcon.className = 'btn search-btn';
    searchIcon.innerHTML = '<i class="bi bi-search text-white"></i>';
    inputGroupPrepend.appendChild(searchIcon);
    
    const searchInputLabel = document.createElement('label');
    searchInputLabel.setAttribute('for', 'search');
    searchInputLabel.textContent = 'Search for users...'; // Text for screen readers
    searchInputLabel.className = 'visually-hidden'; // Hide the label but keep it for screen readers
    inputGroup.appendChild(searchInputLabel);

    const searchInput = document.createElement('input');
    searchInput.id = 'search';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for users...';
    searchInput.className = 'form-control border-0 search';
    inputGroup.appendChild(searchInput);

    searchInput.addEventListener('input', () => {
        const search = searchInput.value.trim();
        displayUserCards(search);
    });

    const user_list_row = document.createElement('div');
    user_list_row.className = 'row p-4 user_list_row';
    user_list_row.id = 'user-list-row';
    user_list.appendChild(user_list_row);

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

    const notifications_div = await notifications();
    global_div.appendChild(notifications_div);
}


// Display the user cards that match the search query
function displayUserCards(search = '') {
    const userListRow = document.getElementById('user-list-row');
    const userCols = Array.from(userListRow.children);

    // Filter the `user_col` containing a `userCard` matching the search query
    const matchingUserCols = userCols.filter(userCol => {
        const nickname = userCol.querySelector('.user_nickname').textContent;
        return nickname.toLowerCase().startsWith(search.toLowerCase());
    });

    // Display the matching user cards
    matchingUserCols.forEach(userCol => {
        userCol.classList.remove('invisible'); // Rendre visibles les cartes correspondantes
        userListRow.appendChild(userCol); // Ajouter les cartes triées au conteneur
    });

    // Hide the non-matching user cards
    userCols.forEach(userCol => {
        if (!matchingUserCols.includes(userCol)) {
            userCol.classList.add('invisible'); // Masquer les cartes non correspondantes
        }
    });
}
