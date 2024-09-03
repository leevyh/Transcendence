import { getCookie } from './views/utils.js';

// FR
import { notFoundView } from './views/fr/404.js';
import { homeView } from './views/fr/home.js';
import { registerView } from './views/fr/register.js';
import { loginView } from './views/fr/login.js';
import { settingsView } from './views/fr/settings.js';
import { passwordView } from './views/fr/password.js';
import { chatView } from './views/chat.js'; // FR

// EN
import { notFoundViewEN } from './views/en/404.js';

// SP
import { notFoundViewSP } from './views/sp/404.js';

const appDiv = document.getElementById('app');

export const routes = {
    'fr': {
        '/404': notFoundView,
        '/': homeView,
        '/register': registerView,
        '/login': loginView,
        '/settings': settingsView,
        '/password': passwordView,
        // '/profile': profileView,
        '/chat': chatView,
    },
    'en': {
        '/404': notFoundViewEN,
        '/': homeView,
        '/login': loginView,

    },
    'sp': {
        '/404': notFoundViewSP,
        '/': homeView,
        '/login': loginView,

    }
};

export async function isAuthenticated() {
    try {
        const response = await fetch('/api/check_auth/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log('data:', data);
            return data.value;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Récupérer la langue de l'utilisateur
async function getLang() {
    try {
        const response = await fetch('/api/get_accessibility/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log('data:', data);
            return data.language;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return null;
    }
}

export async function navigateTo(url) {
    console.log('url:', url);
    const isAuth = await isAuthenticated();
    const publicRoutes = ['/login', '/register', '/404'];
    
    // Language de l'utilisateur
    // Si l'url contient deja la langue, on la supprime
    let currentLanguage = null;
    let language = null;
    
    const splitPath = url.split('/');
    if (isAuth === true) {
        // Si l'utilisateur est authentifié
        if (splitPath.length > 2) {
            // Si l'url contient déjà la langue, on la supprime
            url = `/${splitPath[2]}`;
        } 
        language = await getLang();
        currentLanguage = language || 'fr';
    } else {
        // Si l'utilisateur n'est pas authentifié
        if (splitPath.length > 2) {
            // Si l'url contient déjà la langue, on la récupère
            url = `/${splitPath[2]}`;
            language = splitPath[1];
        }
        // Si l'ancienne url contient la langue, on la récupère
        const oldUrl = location.pathname.split('/');
        if (oldUrl.length > 2) {
            language = oldUrl[1];
        }
        currentLanguage = language || 'fr';
    }
    console.log('currentLanguage:', currentLanguage);

    if (!routes[currentLanguage]) {
        // Si la langue n'est pas supportée, rediriger vers la page 404
        history.pushState(null, '', `/${currentLanguage}/404`);
        notFoundView(appDiv);
        return;
    }

    if (!isAuth && !publicRoutes.includes(url)) {
        // Si l'utilisateur n'est pas authentifié et qu'il tente d'accéder à une page privée, rediriger vers la page de connexion
        history.pushState(null, '', '/');
        homeView(appDiv);
    } else {
        // Si l'utilisateur est authentifié
        if (isAuth && (url === '/login' || url === '/register')) {
            history.pushState(null, '', `/${currentLanguage}/`);
            homeView(appDiv);
            return;
        }
        appDiv.innerHTML = '';
        const viewFunction = routes[currentLanguage][url] || notFoundView;
        viewFunction(appDiv);
        history.pushState(null, '', `/${currentLanguage}${url}`);
    }
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const path = `/${event.target.getAttribute('data-link')}`;
        history.pushState(null, '', path);
        navigateTo(path);
    });
});

window.addEventListener('popstate', () => {
    navigateTo(location.pathname);
});

navigateTo(location.pathname || '/');