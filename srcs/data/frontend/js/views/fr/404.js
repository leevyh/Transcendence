// import { navigateTo } from '../utils.js';
import { navigateTo } from '../../app.js';

export function notFoundView(container) {
    container.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = '404 - La page n\'existe pas';

    const p = document.createElement('p');
    p.textContent = 'La page que vous recherchez n\'existe pas.';

    const homeButton = document.createElement('button');
    homeButton.textContent = 'Aller à la page d\'accueil';
    homeButton.className = 'btn btn-primary';
    homeButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/');
    });

    container.appendChild(h1);
    container.appendChild(p);
    container.appendChild(homeButton);
}