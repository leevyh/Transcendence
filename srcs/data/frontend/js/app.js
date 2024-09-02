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
import { homeViewEN } from './views/en/home.js';

// SP
import { notFoundViewSP } from './views/sp/404.js';
import { homeViewSP } from './views/sp/home.js';

const appDiv = document.getElementById('app');
const defaultLang = 'fr'; // ou 'en' selon votre choix
const initialPath = location.pathname !== '/' ? location.pathname : `/${defaultLang}/home`;
navigateTo(initialPath);

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
        '/': homeViewEN,
    },
    'sp': {
        '/404': notFoundViewSP,
        '/': homeViewSP,
    }
};

async function isAuthenticated() {
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

export async function getLang() {
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

export async function navigateTo(view) {
    // On modifie l'URL pour ne garder que la view sans la langue
    const viewParts = view.split('/');

    const isAuth = await isAuthenticated();
    const publicRoutes = ['/login', '/register', '/404'];

    let lang = 'fr'; // Par défaut
    if (isAuth === true) {
        // Extraire la langue dans le choix de l'utilisateur dans le backend
        console.log('isAuth:', isAuth);
        lang = await getLang();
    }
    const currentLang = lang || 'fr'; 

    // Définir la route de base si la langue n'est pas définie
    const viewPath = `/${viewParts.slice(2).join('/')}` || '/';

    if (!routes[currentLang]) {
        // Si la langue n'est pas supportée, rediriger vers la page 404
        history.pushState(null, '', `/${currentLang}/404`);
        notFoundView(appDiv);
        return;
    }

    if (!isAuth && !publicRoutes.includes(viewPath)) {
        history.pushState(null, '', `/${currentLang}/`);
        homeView(appDiv);
    } else {
        if (isAuth && (viewPath === '/login' || viewPath === '/register')) {
            history.pushState(null, '', `/${currentLang}/`);
            homeView(appDiv);
            return;
        }
        appDiv.innerHTML = '';
        const viewFunction = routes[currentLang][viewPath] || notFoundView;

        viewFunction(appDiv);
        history.pushState(null, '', `/${currentLang}${viewPath}`);
    }
}


document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const path = `/${event.target.getAttribute('data-link')}`;
        // history.pushState(null, '', path);
        navigateTo(path);
    });
});

window.addEventListener('popstate', () => {
    navigateTo(location.pathname);
});

navigateTo(location.pathname || '/');