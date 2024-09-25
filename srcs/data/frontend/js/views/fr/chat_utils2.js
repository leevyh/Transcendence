import { DEBUG } from '../../app.js';
export let chatWS = null;


export async function createGlobalContainer() {
    const globalContainer = document.createElement('div');
    globalContainer.className = 'container-fluid h-100 w-100 d-flex justify-content-center';

    const separator = document.createElement('div');
    separator.className = 'row h-100 w-75';
    globalContainer.appendChild(separator);

    const usersContainer = await createUsersContainer();
    separator.appendChild(usersContainer);

    const chatContainer = await createChatContainer();
    separator.appendChild(chatContainer);

    return globalContainer;
}

async function createUsersContainer() {
    const usersContainer = document.createElement('div');
    usersContainer.className = 'col-md-4 col-xl-4 align-content-center contacts';

    const contactsCard = document.createElement('div');
    contactsCard.className = 'card mb-sm-3 mb-md-0 h-75 contacts-card';
    usersContainer.appendChild(contactsCard);

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group p-2';
    contactsCard.appendChild(inputGroup);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.className = 'form-control border-0 search';
    inputGroup.appendChild(searchInput);

    const inputGroupPrepend = document.createElement('div');
    inputGroupPrepend.className = 'input-group-prepend';
    inputGroup.appendChild(inputGroupPrepend);

    const searchIcon = document.createElement('span');
    searchIcon.className = 'btn search-btn';
    searchIcon.innerHTML = '<i class="bi bi-search"></i>';
    inputGroupPrepend.appendChild(searchIcon);

    const contactsBody = document.createElement('div');
    contactsBody.className = 'card-body contacts-body';
    contactsCard.appendChild(contactsBody);

    const usersList = document.createElement('ul');
    usersList.className = 'p-2 user-list';
    usersList.id = 'user-list';
    contactsBody.appendChild(usersList);

    return usersContainer;
}

export function createUserCard(user, userList) {
    let userCard = document.getElementById(user.nickname);
    console.log('userList:', userList);
    console.log('user:', user);

    if (!userCard) {
        userCard = document.createElement('div');
        userCard.className = 'd-flex bd-highlight w-100';
        userCard.id = user.nickname; // ID = nickname
        userList.appendChild(userCard);

        // Create the user image
        const userImgCont = document.createElement('div');
        userCard.appendChild(userImgCont);

        const userImg = document.createElement('img');
        userImg.src = `data:image/png;base64, ${user.avatar}`;;
        userImg.className = 'rounded-circle user-img';
        userImgCont.appendChild(userImg);

        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `<span>${user.nickname}</span><p>${user.status}</p>`;
        userCard.appendChild(userInfo);

    }

    return userCard;












    // // If the user card does not exist, create it
    // if (!userCard) {
    //     userCard = document.createElement('div');
    //     userCard.className = 'card w-100';
    //     userCard.id = user.nickname; // ID = nickname

    //     const userCardBody = document.createElement('div');
    //     userCardBody.className = 'card-body user-connected';

    //     const userNicknameDiv = document.createElement('div');
    //     userNicknameDiv.className = 'user-nickname';
    //     const userNickname = document.createElement('h5');
    //     userNickname.className = 'card-title';
    //     userNickname.textContent = user.nickname;
    //     userNicknameDiv.appendChild(userNickname);

    //     const dot = document.createElement('span');
    //     dot.className = 'dot dot-status';

    //     // Create div for block/unblock buttons
    //     const blockUnblockDiv = document.createElement('div');
    //     blockUnblockDiv.className = 'block-unblock';
    //     blockUnblockDiv.id = 'user.nickname';
    //     blockUnblockDiv.style.display = 'none'; // Initially hidden

    //     // Create Block Button
    //     const blockUserButton = document.createElement('button');
    //     blockUserButton.className = 'btn btn-danger block-button';
    //     blockUserButton.id = 'user.nickname';
    //     blockUserButton.textContent = 'Bloquer';
    //     blockUserButton.addEventListener('click', () => {
    //         blockUser(user.nickname);
    //     });

    //     // Create Unblock Button
    //     const unblockUserButton = document.createElement('button');
    //     unblockUserButton.className = 'btn btn-success unblock-button';
    //     unblockUserButton.id = 'user.nickname';
    //     unblockUserButton.textContent = 'Débloquer';
    //     unblockUserButton.style.display = 'none'; // Initially hidden
    //     unblockUserButton.addEventListener('click', () => {
    //         unblockUser(user.nickname);
    //     });

    //     userCardBody.appendChild(dot);
    //     userCardBody.appendChild(userNicknameDiv);
    //     blockUnblockDiv.appendChild(blockUserButton);
    //     blockUnblockDiv.appendChild(unblockUserButton);
    //     userCardBody.appendChild(blockUnblockDiv);
    //     userCard.appendChild(userCardBody);

    //     // Add click event to open chat
    //     userNicknameDiv.addEventListener('click', () => {
    //         const isChatOpen = document.getElementById('chat-window');
    //         // If the chat is already open for this user, close it. Else, open it.
    //         if (isChatOpen.style.display === 'block' && isChatOpen.querySelector('.chat-title').textContent.includes(user.nickname)) {
    //             const chatBody = document.querySelector('.chat-body');
    //             chatBody.innerHTML = ''; // Clear chat body
    //             isChatOpen.style.display = 'none';
    //         } else {
    //             const chatBody = document.querySelector('.chat-body');
    //             chatBody.innerHTML = ''; // Clear chat body
    //             openChat(user.nickname);
    //             isChatOpen.style.display = 'block';
    //         }
    //     });
    //     userList.appendChild(userCard);
    // }

    // // Update the user's status
    // const dot = userCard.querySelector('.dot');
    // if (user.status === 'online') {
    //     dot.style.backgroundColor = 'green';
    // } else if (user.status === 'in game') {
    //     dot.style.backgroundColor = 'orange';
    // } else if (user.status === 'offline') {
    //     dot.style.backgroundColor = 'red';
    // }
    // return userCard;
}


async function createChatContainer() {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'col-md-4 col-xl-4 align-content-center chat';

    // Create a chatCard to display the chat
    const chatCard = document.createElement('div');
    chatCard.className = 'card h-75 chat-card';
    chatContainer.appendChild(chatCard);

    // Create a card-header for the chatCard with the name of the user
    const chatHeader = await createChatContainerHeader();
    chatCard.appendChild(chatHeader);

    // Create a card-body for the chatCard with the messages
    const chatBody = document.createElement('div');
    chatBody.className = 'card-body msg-card-body';
    chatCard.appendChild(chatBody);

    // Create a card-footer for the chatCard with the input to send messages
    const chatFooter = await createChatContainerFooter();
    chatCard.appendChild(chatFooter);

    return chatContainer;
}

async function createChatContainerHeader() {
    // Create a card-header for the chatCard with the name of the user
    const chatHeader = document.createElement('div');
    chatHeader.className = 'card-header';

    const chatHeaderDiv = document.createElement('div');
    chatHeaderDiv.className = 'd-flex bd-highlight';
    chatHeader.appendChild(chatHeaderDiv);

    const userImgChat = document.createElement('img');
    userImgChat.src = 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'; // Need to be updated with the user's image
    userImgChat.alt = 'user-img';
    userImgChat.className = 'rounded-circle user-img-chat';
    chatHeaderDiv.appendChild(userImgChat);

    const userInfosChat = document.createElement('span');
    userInfosChat.textContent = 'Chat with Khalid'; // Need to be updated with the user's name
    userInfosChat.className = 'user-info-chat w-100 d-flex align-items-center justify-content-start';
    chatHeaderDiv.appendChild(userInfosChat);

    const statusIconChat = document.createElement('span');
    statusIconChat.className = 'online-icon'; // Need to be updated with the status of the user
    chatHeaderDiv.appendChild(statusIconChat);

    // Create a button to see the user's profile
    const profileButton = document.createElement('button');
    profileButton.className = 'btn profile-button';
    profileButton.innerHTML = '<i class="bi bi-person"></i>';
    chatHeaderDiv.appendChild(profileButton);

    // Create a button to block the user
    const blockButton = document.createElement('button');
    blockButton.className = 'btn btn-danger block-button';
    blockButton.innerHTML = '<i class="bi bi-slash-circle"></i>';
    chatHeaderDiv.appendChild(blockButton);


    




    return chatHeader;
}

async function createChatContainerFooter() {
    const chatFooter = document.createElement('div');
    chatFooter.className = 'card-footer w-100 p-2';

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    chatFooter.appendChild(inputGroup);

    const textAreaInput = document.createElement('input');
    textAreaInput.className = 'form-control border-0 type-msg';
    textAreaInput.type = 'text';
    textAreaInput.placeholder = 'Type your message...';
    inputGroup.appendChild(textAreaInput);

    const sendBtnSpan = document.createElement('span');
    sendBtnSpan.className = 'btn send-btn';
    sendBtnSpan.innerHTML = '<i class="bi bi-chevron-up"></i>'; // TODO: Add the event listener to send the message
    inputGroup.appendChild(sendBtnSpan);

    return chatFooter;
}