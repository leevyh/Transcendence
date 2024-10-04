import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { navigationBar } from './navigation.js';
import { createGlobalContainer, createUserCard } from '../component/chat/visual.js';

export function profileView(container) {

	container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navBarContainer = navigationBar(container);
    div.appendChild(navBarContainer);

    const viewContainer = createGlobalContainer();
    div.appendChild(viewContainer);



}
