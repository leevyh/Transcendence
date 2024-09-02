import { navigateTo } from '../../app.js';
import { getCookie } from '../utils.js';

export function homeView(container) {
    container.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = 'Page d\'accueil';

    const p = document.createElement('p');
    p.textContent = 'Bienvenue sur la page d\'accueil!';

    // Bouton pour aller à la page de connexion
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Se connecter';
    loginButton.className = 'btn btn-primary';
    loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/login');
    });

    // Bouton pour aller à la page d'inscription
    const registerButton = document.createElement('button');
    registerButton.textContent = 'S\'inscrire';
    registerButton.className = 'btn btn-primary';
    registerButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/register');
    });

    // Bouton de déconnexion
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Se déconnecter';
    logoutButton.className = 'btn btn-danger';
    logoutButton.addEventListener('click', (event) => {
        fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => response.json())
        .then(data => {
            localStorage.removeItem('token');
            console.log(data);

            event.preventDefault();
            navigateTo('/login');
        });
    });

    // Bouton d'accès aux paramètres
    const settingsButton = document.createElement('button');
    settingsButton.textContent = 'Paramètres';
    settingsButton.className = 'btn btn-primary';
    settingsButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/settings');
    });

    container.appendChild(h1);
    container.appendChild(p);

    // Si l'utilisateur est connecté, on affiche le bouton de déconnexion
    // Sinon, on affiche les boutons de connexion et d'inscription
    const token = localStorage.getItem('token'); // A modifier avec appel API
    if (token) {
        container.appendChild(settingsButton);
        container.appendChild(logoutButton);
    } else {
        container.appendChild(loginButton);
        container.appendChild(registerButton);
    }
}