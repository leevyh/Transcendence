import { navigationBar } from './navigation.js';
import { DEBUG } from '../app.js';


export async function leaderboardView(container) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);
    
    const navBarContainer = navigationBar(container);
    div.appendChild(navBarContainer);
    
    const viewContainer = document.createElement('div');
    div.appendChild(viewContainer);
}