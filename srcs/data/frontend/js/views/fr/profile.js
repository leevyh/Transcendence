import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { navigationBar } from './navigation.js';
import { createGlobalContainer, createUserCard } from './chat_utils.js';
export function profileView(container) {

	container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navBarContainer = navigationBar(container);
    div.appendChild(navBarContainer);

    const viewContainer = await createGlobalContainer();
    div.appendChild(viewContainer);

}
