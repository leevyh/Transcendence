import { navigateTo } from '../app.js';

export function notFoundView(container) {
    container.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = '404 - Not found.';

    const div = document.createElement('div');
    div.className = 'text-center';

    const img = document.createElement('img');
    img.id = 'error404';
    img.src = '/js/img/404-error.png';
    img.width = 400;
    img.height = 400;
    img.className = 'rounded';
    img.alt = '404';

    const homeButton = document.createElement('button');
    homeButton.textContent = 'Home';
    homeButton.className = 'btn btn-primary';
    homeButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/');
    });

    container.appendChild(h1);
    div.appendChild(img);
    container.appendChild(div);
    // container.appendChild(homeButton);
}