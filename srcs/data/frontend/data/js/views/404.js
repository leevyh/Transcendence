import { navigateTo } from '../app.js';

export function notFoundView(container) {
    container.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = '404 - Not found.';

    const div = document.createElement('div');
    div.className = 'text-center';

    const homeButton = document.createElement('button');
    homeButton.textContent = 'Home';
    homeButton.className = 'btn btn-primary';
    homeButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/');
    });

    container.appendChild(h1);
    container.appendChild(div);
    // container.appendChild(homeButton);
}