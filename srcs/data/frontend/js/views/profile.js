import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { navigationBar } from './navigation.js';
import { DEBUG } from '../app.js';

export function profileView(container) {

	container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100 bg-primary';
    container.appendChild(div);

    const navBarContainer = navigationBar(container);
    div.appendChild(navBarContainer);

    const viewContainer = document.createElement('div');
    div.appendChild(viewContainer);


    if (DEBUG) {console.log('Profile view for user:', userID);}

}
