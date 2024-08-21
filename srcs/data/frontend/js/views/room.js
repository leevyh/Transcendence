import { navigateTo } from './utils.js';

export function roomView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create elements
    const h1 = document.createElement('h1');
    h1.textContent = 'Room';

    // Créer l'élément head et son contenu
    const head = document.head;

    const title = document.createElement('title');
    title.textContent = 'Chat';
    head.appendChild(title);

    const style = document.createElement('style');
    style.textContent = `
        #chatLog {
            height: 300px;
            background-color: #FFFFFF;
            resize: none;
        }
        #onlineUsersSelector {
            height: 300px;
        }
    `;
    head.appendChild(style);

    // Créer l'élément body et son contenu
    const body = document.body;

    container.className = 'container mt-3 p-5';
    body.appendChild(container);

    const h2 = document.createElement('h2');
    h2.textContent = 'RoomName?';
    container.appendChild(h2);

    const row = document.createElement('div');
    row.className = 'row';
    container.appendChild(row);

    const colLeft = document.createElement('div');
    colLeft.className = 'col-12 col-md-8';
    row.appendChild(colLeft);

    const mb2 = document.createElement('div');
    mb2.className = 'mb-2';
    colLeft.appendChild(mb2);

    const labelChatLog = document.createElement('label');
    labelChatLog.setAttribute('for', 'chatLog');
    labelChatLog.textContent = 'Room: #' + roomName;  // roomName should be defined in the script context
    mb2.appendChild(labelChatLog);

    const chatLog = document.createElement('textarea');
    chatLog.id = 'chatLog';
    chatLog.className = 'form-control';
    chatLog.readOnly = true;
    mb2.appendChild(chatLog);

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    colLeft.appendChild(inputGroup);

    const chatMessageInput = document.createElement('input');
    chatMessageInput.type = 'text';
    chatMessageInput.id = 'chatMessageInput';
    chatMessageInput.className = 'form-control';
    chatMessageInput.placeholder = 'Type a message...';
    inputGroup.appendChild(chatMessageInput);

    const inputGroupAppend = document.createElement('div');
    inputGroupAppend.className = 'input-group-append';
    inputGroup.appendChild(inputGroupAppend);

    const chatMessageSend = document.createElement('button');
    chatMessageSend.type = 'button';
    chatMessageSend.id = 'chatMessageSend';
    chatMessageSend.className = 'btn btn-success';
    chatMessageSend.textContent = 'Send';
    inputGroupAppend.appendChild(chatMessageSend);

    const colRight = document.createElement('div');
    colRight.className = 'col-12 col-md-4';
    row.appendChild(colRight);

    const labelOnlineUsers = document.createElement('label');
    labelOnlineUsers.setAttribute('for', 'onlineUsersSelector');
    labelOnlineUsers.textContent = 'Online users:';
    colRight.appendChild(labelOnlineUsers);

    const onlineUsersSelector = document.createElement('select');
    onlineUsersSelector.className = 'form-control';
    onlineUsersSelector.id = 'onlineUsersSelector';
    onlineUsersSelector.multiple = true;
    colRight.appendChild(onlineUsersSelector);

    document.body.appendChild(container);
}
