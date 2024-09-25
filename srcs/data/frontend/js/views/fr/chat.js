import { getCookie } from '../utils.js';
// import { createGlobalContainer, createUserCard } from './chat_utils.js';
import { DEBUG } from '../../app.js';
import { navBar } from './nav.js';

// export async function chatView(container) {
//     container.innerHTML = '';

//     // Creation big div for the chat and the navigation bar
//     const div = document.createElement('div');
//     div.className= 'big-div';
//     container.appendChild(div);

//     const nav = navBar(container);
//     div.appendChild(nav);

//     const globalContainer = await createGlobalContainer();
//     div.appendChild(globalContainer);

//     // Create the WebSocket for user status
//     const statusSocket = new WebSocket('ws://' + window.location.host + '/ws/status/');

//     // Onopen event
//     statusSocket.onopen = function(event) {
//         if (DEBUG) {console.log('Status socket opened');}
//     };

//     // On message received from the server (status of a user)
//     statusSocket.onmessage = function(event) {
//         // FIXME: Handle the message properly, if I'm the one who sent the message, don't send an error
//         const data = JSON.parse(event.data);
//         if (DEBUG) {console.log('Message received:', data);}
//         // Update the user list with the new status
//         const userList = document.getElementById('user-list');
//         createUserCard(data, userList);
//     };

//     // Onclose event
//     statusSocket.onclose = function(event) {
//         if (DEBUG) {console.error('Status socket closed', event);}
//     };

//     const userList = document.getElementById('user-list');

//     // Call API to get the list of users
//     fetch('/api/users/', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//             'X-CSRFToken': getCookie('csrftoken'),
//         },
//     })
//     .then(response => response.json())
//     .then(data => {
//         // For each user, create a user card
//         data.forEach(user => {
//             createUserCard(user, userList);
//         });
//     })
//     .catch(error => {
//         if (DEBUG) {console.error('Error:', error);}
//     });
// }




// export function chatView(container) {
   
//     // Fonction pour créer un contact
//     function createContact(name, imageSrc, statusText, isOnline) {
//         const contactItem = document.createElement('li');
//         if (isOnline) contactItem.className = 'active';

//         const contactDiv = document.createElement('div');
//         contactDiv.className = 'd-flex bd-highlight';

//         const imgCont = document.createElement('div');
//         imgCont.className = 'img_cont';

//         const userImg = document.createElement('img');
//         userImg.src = imageSrc;
//         userImg.className = 'rounded-circle user_img';

//         const onlineIcon = document.createElement('span');
//         onlineIcon.className = isOnline ? 'online_icon' : 'online_icon offline';

//         imgCont.appendChild(userImg);
//         imgCont.appendChild(onlineIcon);

//         const userInfo = document.createElement('div');
//         userInfo.className = 'user_info';
//         userInfo.innerHTML = `<span>${name}</span><p>${statusText}</p>`;

//         contactDiv.appendChild(imgCont);
//         contactDiv.appendChild(userInfo);
//         contactItem.appendChild(contactDiv);

//         return contactItem;
//     }

//         // Ajout des contacts dans la liste
//         contactsList.appendChild(createContact('Khalid', 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg', 'Kalid is online', true));
//         contactsList.appendChild(createContact('Taherah Big', 'https://2.bp.blogspot.com/-8ytYF7cfPkQ/WkPe1-rtrcI/AAAAAAAAGqU/FGfTDVgkcIwmOTtjLka51vineFBExJuSACLcBGAs/s320/31.jpg', 'Taherah left 7 mins ago', false));
//         contactsList.appendChild(createContact('Sami Rafi', 'https://i.pinimg.com/originals/ac/b9/90/acb990190ca1ddbb9b20db303375bb58.jpg', 'Sami is online', true));
//         contactsList.appendChild(createContact('Nargis Hawa', 'http://profilepicturesdp.com/wp-content/uploads/2018/07/sweet-girl-profile-pictures-9.jpg', 'Nargis left 30 mins ago', false));
//         contactsList.appendChild(createContact('Rashid Samim', 'https://static.turbosquid.com/Preview/001214/650/2V/boy-cartoon-3D-model_D.jpg', 'Rashid left 50 mins ago', false));

//         // contactsBody.appendChild(contactsList);
//         // contactsCard.appendChild(contactsHeader);
//         // contactsCard.appendChild(contactsBody);
//         // contactsCol.appendChild(contactsCard);

//         // Colonne principale de chat
//         // const chatCol = document.createElement('div');
//         // chatCol.className = 'col-md-8 col-xl-8 chat';

//         // const chatCard = document.createElement('div');
//         // chatCard.className = 'card contacts_card';

//         // // Header du chat
//         // const chatHeader = document.createElement('div');
//         // chatHeader.className = 'card-header msg_head';

//         // const chatHeaderDiv = document.createElement('div');
//         // chatHeaderDiv.className = 'd-flex bd-highlight';

//         // const imgContChat = document.createElement('div');
//         // imgContChat.className = 'img_cont';

//         // const userImgChat = document.createElement('img');
//         // userImgChat.src = 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg';
//         // userImgChat.className = 'rounded-circle user_img';

//         // const onlineIconChat = document.createElement('span');
//         // onlineIconChat.className = 'online_icon';

//         // imgContChat.appendChild(userImgChat);
//         // imgContChat.appendChild(onlineIconChat);

//         // const userInfoChat = document.createElement('div');
//         // userInfoChat.className = 'user_info';
//         // userInfoChat.innerHTML = '<span>Chat with Khalid</span><p>1767 Messages</p>';



//         // chatHeaderDiv.appendChild(imgContChat);
//         // chatHeaderDiv.appendChild(userInfoChat);

//         // chatHeader.appendChild(chatHeaderDiv);

//         // // Body du chat avec les messages
//         // const chatBody = document.createElement('div');
//         // chatBody.className = 'card-body msg_card_body';

//         // Fonction pour créer un message
//         function createMessage(content, time, isSent) {
//             const messageDiv = document.createElement('div');
//             messageDiv.className = `d-flex justify-content-${isSent ? 'end' : 'start'} mb-4`;

//             const imgContMsg = document.createElement('div');
//             imgContMsg.className = 'img_cont_msg';

//             const userImgMsg = document.createElement('img');
//             userImgMsg.src = 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg';
//             userImgMsg.className = 'rounded-circle user_img_msg';

//             imgContMsg.appendChild(userImgMsg);

//             const msgContainer = document.createElement('div');
//             msgContainer.className = isSent ? 'msg_cotainer_send' : 'msg_cotainer';
//             msgContainer.innerHTML = `${content}<span class="msg_time${isSent ? '_send' : ''}">${time}</span>`;

//             if (isSent) {
//                 messageDiv.appendChild(msgContainer);
//                 messageDiv.appendChild(imgContMsg);
//             } else {
//                 messageDiv.appendChild(imgContMsg);
//                 messageDiv.appendChild(msgContainer);
//             }

//             return messageDiv;
//         }

//         // Ajout des messages
//         chatBody.appendChild(createMessage('Hi, how are you samim?', '8:40 AM, Today', false));
//         chatBody.appendChild(createMessage('Hi Khalid i am good tnx how about you?', '8:55 AM, Today', true));
//         chatBody.appendChild(createMessage('I am good too, thank you for your chat template', '9:00 AM, Today', false));
//         chatBody.appendChild(createMessage('You are welcome', '9:05 AM, Today', true));
//         chatBody.appendChild(createMessage('I am looking for your next templates', '9:07 AM, Today', false));
//         chatBody.appendChild(createMessage('Ok, thank you have a good day', '9:10 AM, Today', true));
//         chatBody.appendChild(createMessage('Bye, see you', '9:12 AM, Today', false));

//         // Footer du chat avec l'entrée de message
//         const chatFooter = document.createElement('div');
//         chatFooter.className = 'card-footer msg_footer';

//         const inputGroupChat = document.createElement('div');
//         inputGroupChat.className = 'input-group';

//         const inputGroupAppendChat = document.createElement('div');
//         inputGroupAppendChat.className = 'input-group-append';

//         const attachBtn = document.createElement('span');
//         attachBtn.className = 'input-group-text attach_btn';
//         attachBtn.innerHTML = '<i class="bi bi-paperclip"></i>';

//         inputGroupAppendChat.appendChild(attachBtn);

//         const textArea = document.createElement('textarea');
//         textArea.className = 'form-control type_msg';
//         textArea.placeholder = 'Type your message...';

//         const sendBtnSpan = document.createElement('span');
//         sendBtnSpan.className = 'input-group-text send_btn';
//         sendBtnSpan.innerHTML = '<i class="bi bi-chevron-up"></i>';

//         const inputGroupAppendSend = document.createElement('div');
//         inputGroupAppendSend.className = 'input-group-append';
//         inputGroupAppendSend.appendChild(sendBtnSpan);

//         inputGroupChat.appendChild(inputGroupAppendChat);
//         inputGroupChat.appendChild(textArea);
//         inputGroupChat.appendChild(inputGroupAppendSend);

//         chatFooter.appendChild(inputGroupChat);

//         // Construction finale
//         chatCard.appendChild(chatHeader);
//         chatCard.appendChild(chatBody);
//         chatCard.appendChild(chatFooter);
//         chatCol.appendChild(chatCard);

//         rowDiv.appendChild(contactsCol);
//         rowDiv.appendChild(chatCol);
//         containerFluid.appendChild(rowDiv);
//         container.appendChild(div);
//     });
// }


import { createGlobalContainer, createUserCard } from './chat_utils2.js';
export async function chatView(container) {
    container.innerHTML = '';

    // Creation une grosse div pour le pong et la navigation bar
    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navigationBar = navBar(container);
    div.appendChild(navigationBar);

    const globalContainer = await createGlobalContainer();
    div.appendChild(globalContainer);

    // Create the WebSocket for user status
    const statusSocket = new WebSocket('ws://' + window.location.host + '/ws/status/');

    // Onopen event
    statusSocket.onopen = function(event) {
        if (DEBUG) {console.log('Status socket opened');}
    };

    // On message received from the server (status of a user)
    statusSocket.onmessage = function(event) {
        // FIXME: Handle the message properly, if I'm the one who sent the message, don't send an error
        const data = JSON.parse(event.data);
        if (DEBUG) {console.log('Message received:', data);}
        // Update the user list with the new status
        const userList = document.getElementById('user-list');
        createUserCard(data, userList);
    };

    // Onclose event
    statusSocket.onclose = function(event) {
        if (DEBUG) {console.error('Status socket closed', event);}
    };

    const userList = document.getElementById('user-list');

    // Call API to get the list of users
    fetch('/api/users/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => response.json())
    .then(data => {
        // For each user, create a user card
        data.forEach(user => {
            createUserCard(user, userList);
        });
    })
    .catch(error => {
        if (DEBUG) {console.error('Error:', error);}
    });
}