import { changeLanguage } from '../utils.js';
import { getCookie } from '../utils.js';
import { navigateTo, isAuthenticated } from '../../app.js';

export async function homeView(container) {
    container.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.setAttribute('data-i18n', 'home');
    h1.textContent = 'Page d\'accueil';

    const p = document.createElement('p');
    p.setAttribute('data-i18n', 'welcome');
    p.textContent = 'Bienvenue sur la page d\'accueil!';

// SELECTEUR DE LANGUE
    const languageDiv = document.createElement('div');
    languageDiv.id = 'language';

    const languageSelector = document.createElement('select');
    languageSelector.id = 'language-selector';

    const optionFr = document.createElement('option');
    optionFr.value = 'fr';
    optionFr.innerHTML = '🇫🇷&emsp;FR';

    const optionEn = document.createElement('option');
    optionEn.value = 'en';
    optionEn.innerHTML = '🇬🇧&emsp;EN';

    const optionEs = document.createElement('option');
    optionEs.value = 'sp';
    optionEs.innerHTML = '🇪🇸&emsp;SP';

    languageSelector.appendChild(optionFr);
    languageSelector.appendChild(optionEn);
    languageSelector.appendChild(optionEs);
    languageDiv.appendChild(languageSelector);
    container.appendChild(languageDiv);

    let choiceLanguage = 'fr';
    document.querySelector("#language-selector").addEventListener("change", function() {
        console.log('this.value', this.value);
        choiceLanguage = this.value;
        changeLanguage(this.value);
    });

 // BOUTONS CONNEXION
    const loginButton = document.createElement('button');
    loginButton.setAttribute('data-i18n', 'login');
    loginButton.textContent = 'Se connecter';
    loginButton.className = 'btn btn-primary';
    loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('nouvelle url:', '/' + choiceLanguage + '/login');
        navigateTo('/' + choiceLanguage + '/login');
    });

// BOUTONS INSCRIPTION
    const registerButton = document.createElement('button');
    registerButton.setAttribute('data-i18n', 'register');
    registerButton.textContent = 'S\'inscrire';
    registerButton.className = 'btn btn-primary';
    registerButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/' + choiceLanguage + '/register');
    });

// BOUTON DECONNEXION
    const logoutButton = document.createElement('button');
    logoutButton.setAttribute('data-i18n', 'logout');
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
            navigateTo('/' + choiceLanguage + '/login');
        });
    });

// BOUTON PARAMETRES
    const settingsButton = document.createElement('button');
    settingsButton.setAttribute('data-i18n', 'settings');
    settingsButton.textContent = 'Paramètres';
    settingsButton.className = 'btn btn-primary';
    settingsButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/' + choiceLanguage + '/settings');
    });

    container.appendChild(h1);
    container.appendChild(p);

    const isAuth = await isAuthenticated();
    if (isAuth) {
        container.appendChild(settingsButton);
        container.appendChild(logoutButton);
    } else {
        container.appendChild(loginButton);
        container.appendChild(registerButton);
    }
}
