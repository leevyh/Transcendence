import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { navigationBar } from './navigation.js';
import { createmainDiv, createUserCard } from '../component/chat/visual.js';

export function profileView(container) {

	container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100 bg-primary';
    container.appendChild(div);

    const navBarContainer = navigationBar(container);
    div.appendChild(navBarContainer);

    const mainDiv = document.createElement('div');
    mainDiv.className = 'h-100 w-100 d-flex justify-content-center overflow-auto bg-light-subtle';
    container.appendChild(mainDiv);

    const separator = document.createElement('div');
    separator.className = 'row h-100 w-75 bg-warning';
    mainDiv.appendChild(separator);

    const usersContainer = document.createElement('div');
    usersContainer.className = 'bg-success';
    separator.appendChild(usersContainer);

    const chatContainer = document.createElement('div');
    chatContainer.className = 'bg-danger';
    separator.appendChild(chatContainer);



}
