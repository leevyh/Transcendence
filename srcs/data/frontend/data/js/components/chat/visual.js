import { DEBUG, navigateTo } from '../../app.js';
import { chatWS, blockUnblockUser, handleMessage, openChatWithUser, displayUsers, inviteUserToPlay } from './functions.js';

// Function to create the global container for the chat view
export async function createGlobalContainer() {
    const globalContainer = document.createElement('div');
    globalContainer.className = 'h-75 w-100 d-flex justify-content-center overflow-auto align-self-center';

    const separator = document.createElement('div');
    separator.className = 'row h-100 w-75';
    globalContainer.appendChild(separator);

    const usersContainer = await createUsersContainer();
    separator.appendChild(usersContainer);

    const chatContainer = createChatContainer();
    separator.appendChild(chatContainer);

    return globalContainer;
}

// Function to create the users container
async function createUsersContainer() {
    const usersContainer = document.createElement('div');
    usersContainer.className = 'align-content-center contacts';

    const contactsCard = document.createElement('div');
    contactsCard.className = 'card mb-sm-3 mb-md-0 h-100 shadow-sm contacts-card';
    usersContainer.appendChild(contactsCard);

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group p-2';
    contactsCard.appendChild(inputGroup);

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
    searchInput.placeholder = 'Search...';
    searchInput.className = 'form-control border-0 search';
    inputGroup.appendChild(searchInput);

    searchInput.addEventListener('input', () => {
        const search = searchInput.value.trim();
        const userList = document.getElementById('user-list');
        const users = userList.children;

        // Display all users according to the search
        displayUsers(users, search);
    });

    const contactsBody = document.createElement('div');
    contactsBody.className = 'card-body w-100 h-100 overflow-auto contacts-body';
    contactsCard.appendChild(contactsBody);

    const usersList = document.createElement('div');
    usersList.className = 'p-2 user-list';
    usersList.id = 'user-list';
    contactsBody.appendChild(usersList);

    return usersContainer;
}

// Function to create a user card
export function createUserCard(user, userList) {
    if (DEBUG) {console.log('User:', user);}
    let chat_card_id = `chat_card_${user.user_id}`;
    let userCard = document.getElementById(chat_card_id);
    if (!userCard) {
        userCard = document.createElement('div');
        userCard.className = 'd-flex align-items-center bd-highlight justify-content-between w-100 chat_card';
        userCard.id = chat_card_id; // ID = nickname
        userList.appendChild(userCard);

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'position-relative d-inline-block';
        userCard.appendChild(avatarDiv);

        const userAvatar = document.createElement('img');
        userAvatar.alt = 'User image';
        userAvatar.className = 'user-img rounded-circle chat-user-img';
        userAvatar.src = `data:image/png;base64, ${user.avatar}`;
        avatarDiv.appendChild(userAvatar);

        const userStatusDot = document.createElement('span');
        userStatusDot.className = 'rounded-circle position-absolute status-icon';
        avatarDiv.appendChild(userStatusDot);
        
        const userInfo = document.createElement('div');
        userInfo.className = 'mt-auto mb-auto user-info';
        userInfo.innerHTML = `<span>${user.nickname}</span>`;
        userInfo.setAttribute('aria-label', `Chat with ${user.nickname}`);
        userInfo.setAttribute('role', 'button');
        userInfo.setAttribute('tabindex', '0');
        userCard.appendChild(userInfo);

        // Make it clickable with the keyboard
        userInfo.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                userInfo.click();
            }
        });
        
        const userStatus = document.createElement('div');
        userStatus.className = 'user-status';
        userStatus.textContent = 'offline';
        userInfo.appendChild(userStatus);
    
        userInfo.addEventListener('click', () => {
            // If chatWindow is already open for the user, do nothing
            const chatWindow = document.getElementById(`chat_user_${user.user_id}`);
            if (chatWindow && chatWindow.classList.contains('active')) {
                return;
            }
            openChatWithUser(user);
        });
    }

    // Update the user avatar if the user changed it
    const userAvatar = userCard.querySelector('.user-img');
    if (userAvatar.src !== `data:image/png;base64, ${user.avatar}`) {
        userAvatar.src = `data:image/png;base64, ${user.avatar}`;
    }

    // Update the status dot color
    const userStatusDot = userCard.querySelector('.status-icon');
    if (user.status === 'online') {
        userStatusDot.style.backgroundColor = 'green';
    } else if (user.status === 'offline') {
        userStatusDot.style.backgroundColor = 'red';
    } else if (user.status === 'playing') {
        userStatusDot.style.backgroundColor = 'orange';
    }

    // Update the nickname on the userCard if the user changed it
    const userInfo = userCard.querySelector('.user-info');
    if (userInfo.children[0].textContent !== user.nickname) {
        userInfo.children[0].textContent = user.nickname;
    }

    // Change chatTitle if the user changes his nickname
    const chatWindow = document.getElementById(`chat_user_${user.user_id}`);
    if (chatWindow && chatWindow.classList.contains('active')) {
        if (chatWindow.querySelector('.chat-title').textContent !== `Chat with ${user.nickname}`) {
            chatWindow.querySelector('.chat-title').textContent = `Chat with ${user.nickname}`;
        }
    }

    // Update the user status
    const userStatus = userCard.querySelector('.user-status');
    userStatus.textContent = user.status;

    // Sort the users list
    const users = userList.children;
    for (let i = 0; i < users.length; i++) {
        const userCard = users[i];
        if (userCard.classList.contains('invisible')) {
            continue;
        }
        let j = i;
        while (j > 0 && userCard.textContent.toLowerCase() < users[j - 1].textContent.toLowerCase()) {
            userList.insertBefore(userCard, users[j - 1]);
            j--;
        }
    }

    return userCard;
}

// Function to create the chat container
function createChatContainer() {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'col-md-4 col-xl-4 chat';
    chatContainer.id = 'chat-container';

    return chatContainer;
}


// Function to create the chat window for a user
export function createChatWindow(user) {
    let chat_user_id = `chat_user_${user.user_id}`;
    const chatWindow = document.createElement('div');
    chatWindow.className = 'card chat-window position-absolute'; // absolute position for superposition
    chatWindow.id = chat_user_id;

    const chatWindowInner = document.createElement('div');
    chatWindowInner.className = 'd-flex flex-column h-100 chat-window-inner';
    chatWindow.appendChild(chatWindowInner);

    const chatHeader = createChatContainerHeader(user);
    chatWindowInner.appendChild(chatHeader);

    const chatBody = document.createElement('div');
    chatBody.className = 'card-body overflow-auto flex-grow-1 chat-body';
    chatWindowInner.appendChild(chatBody);

    const chatFooter = createChatContainerFooter();
    chatWindowInner.appendChild(chatFooter);

    return chatWindow;
}


// Function to create the chat container header
function createChatContainerHeader(user) {
    const chatHeader = document.createElement('div');
    chatHeader.className = 'card-header d-flex justify-content-between chat-header';

    const div1 = document.createElement('div');
    div1.className = 'd-flex align-items-center';
    chatHeader.appendChild(div1);

    const chatTitle = document.createElement('span');
    chatTitle.textContent = 'Chat with ' + user.nickname;
    chatTitle.className = 'mt-auto mb-auto text-white chat-title';
    div1.appendChild(chatTitle);

    const div2 = document.createElement('div');
    div2.className = 'd-flex align-items-center';
    div2.id = 'chat-header-buttons';
    chatHeader.appendChild(div2);

    const profileButton = document.createElement('button');
    profileButton.id = 'view-profile-button';
    profileButton.className = 'btn btn-outline-light view-profile-button';
    profileButton.innerHTML = '<i class="bi bi-person-lines-fill"></i>';
    profileButton.setAttribute('aria-label', 'View profile');
    div2.appendChild(profileButton);
    profileButton.style.display = 'block';
    profileButton.addEventListener('click', () => {
        navigateTo(`/profile/${user.user_id}`);
    });

    const inviteGameButton = document.createElement('button');
    inviteGameButton.id = 'invite-game-button';
    inviteGameButton.className = 'btn btn-outline-primary invite-game-button';
    inviteGameButton.innerHTML = '<i class="bi bi-controller"></i>';
    inviteGameButton.setAttribute('aria-label', 'Invite to game');
    div2.appendChild(inviteGameButton);
    inviteGameButton.addEventListener('click', () => {
        inviteUserToPlay(user);
    });

    const blockButton = document.createElement('button');
    blockButton.id = 'block-button';
    blockButton.className = "btn btn-outline-danger bi-slash-circle block-button";
    blockButton.style.color = 'red';
    blockButton.setAttribute('aria-label', `Block/Unblock ${user.nickname}`);
    div2.appendChild(blockButton);
    blockButton.addEventListener('click', () => {
        if (DEBUG) {console.log('Block/Unblock button clicked');}
        blockUnblockUser(user.nickname);
    });

    return chatHeader;
}

// Function to create the chat container footer
function createChatContainerFooter() {
    const chatFooter = document.createElement('div');
    chatFooter.className = 'card-footer w-100 p-2';
    chatFooter.id = 'chat-footer';

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    chatFooter.appendChild(inputGroup);

    const chatInputLabel = document.createElement('label');
    chatInputLabel.setAttribute('for', 'chat-input');
    chatInputLabel.textContent = 'Type your message...'; // Text for screen readers
    chatInputLabel.className = 'visually-hidden'; // Hide the label but keep it for screen readers
    inputGroup.appendChild(chatInputLabel);

    const chatInput = document.createElement('input');
    chatInput.id = 'chat-input';
    chatInput.type = 'text';
    chatInput.className = 'form-control border-0 chat-input';
    chatInput.placeholder = 'Type your message...';
    inputGroup.appendChild(chatInput);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && chatInput.value !== '') {
            chatSendButton.click();
        }
    });

    const chatSendButton = document.createElement('button');
    chatSendButton.className = 'btn send-btn chat-send-button';
    chatSendButton.setAttribute('aria-label', 'Send message');
    chatSendButton.innerHTML = '<i class="bi bi-chevron-up text-white"></i>';
    inputGroup.appendChild(chatSendButton);
    chatSendButton.addEventListener('click', () => {
        const message = chatInput.value;
        if (message !== '' && chatWS && chatWS.readyState === WebSocket.OPEN) {
            handleMessage(message);
        }
        chatInput.value = '';
    });

    return chatFooter;
}