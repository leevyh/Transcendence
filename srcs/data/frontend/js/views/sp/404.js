import { navigateTo } from '../../app.js';

export function notFoundViewSP(container) {
    container.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = '404 - Pagina non trovata';

    const p = document.createElement('p');
    p.textContent = 'La pagina che stai cercando non esiste.';

    const homeButton = document.createElement('button');
    homeButton.textContent = 'Vai alla Home';
    homeButton.className = 'btn btn-primary';
    homeButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/');
    });

    container.appendChild(h1);
    container.appendChild(p);
    container.appendChild(homeButton);
}