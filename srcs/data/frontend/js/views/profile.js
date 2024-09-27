import { navigationBar } from './navigation.js';
import { DEBUG } from '../app.js';


export async function profileView(container, userID) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);
    
    const navBarContainer = navigationBar(container);
    div.appendChild(navBarContainer);
    
    const viewContainer = document.createElement('div');
    div.appendChild(viewContainer);
    
    
    if (DEBUG) {console.log('Profile view for user:', userID);}

}