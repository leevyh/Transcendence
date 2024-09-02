import { notFoundView } from './fr/404.js';
// import { homeView } from './fr/home.js';
// import { registerView } from './fr/register.js';
// import { loginView } from './fr/login.js';
// import { settingsView } from './fr/settings.js';
// import { passwordView } from './fr/password.js';
// import { chatView } from './chat.js';

// Helper function to get CSRF token from cookies
export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

export async function navigateTo(url) {
    // Recuperer la langue de l'utilisateur
    let language = 'fr'; // Par défaut

    //TODO CHECK IF USER IS AUTHENTICATED BEFORE GETTING LANGUAGE
    language = await getLang();
    const currentLang = language || 'fr'; 

    // Update the URL in the address bar
    history.pushState(null, null, url);

    // Handle the route change
    handleRouteChange(currentLang);
}

import { routes } from '../app.js';
import { getLang } from '../app.js';
function handleRouteChange(language) {
    const container = document.getElementById('app');
    const path = window.location.pathname;

    if (!routes[language]) {
        // Si la langue n'est pas supportée, rediriger vers la page 404
        history.pushState(null, '', `/${language}/404`);
        notFoundView(container); // FIXME Modifier pour afficher la vue 404 en fonction de la langue 
        return;
    }

    container.innerHTML = '';
    const viewFunction = routes[language][path] || notFoundView; // FIXME Modifier pour afficher la vue 404 en fonction de la langue 

    viewFunction(container);
    history.pushState(null, '', `/${language}${path}`);

    // if (path === '/login') {
    //     loginView(container);
    // } else if (path === '/') {
    //     homeView(container);
    // } else if (path === '/register') {
    //     registerView(container);
    // } else if (path === '/settings') {
    //     settingsView(container);
    // } else if (path === '/chat') {
    //     chatView(container);
    // } else if (path === '/password') {
    //     passwordView(container);
    // } else {
    //     notFoundView(container);
    // }
    // Add more else if clauses for new routes
}