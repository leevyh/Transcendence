import { isAuthenticated, getAccessibility, applyAccessibilitySettings } from './views/utils.js';

// FR
import { notFoundView } from './views/fr/404.js';
import { homeView } from './views/fr/home.js';
import { registerView } from './views/fr/register.js';
import { loginView } from './views/fr/login.js';
import { settingsView } from './views/fr/settings.js';
import { passwordView } from './views/fr/password.js';
import { chatView } from './views/chat.js';

const appDiv = document.getElementById('app');

const routes = {
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
        '/404': notFoundView,
        '/': homeView,
        '/login': loginView,
        '/register': registerView,
        '/settings': settingsView,
    },
    'sp': {
        '/404': notFoundView,
        '/': homeView,
        '/login': loginView,
        '/register': registerView,
        '/settings': settingsView,
    }
};


export async function navigateTo(url) {
    const isAuth = await isAuthenticated();
    const publicRoutes = ['/login', '/register', '/404'];

    let currentLanguage = null;
    let language = null;

    const splitPath = url.split('/');
    let userSettings = null;

    if (isAuth === true) {
        if (splitPath.length > 2) {
            url = `/${splitPath[2]}`;
        }
        userSettings = await getAccessibility();
        language = `${userSettings.language}`;
        currentLanguage = language || 'fr';
    } else {
        if (splitPath.length > 2) {
            url = `/${splitPath[2]}`;
            language = splitPath[1];
        }
        const oldUrl = location.pathname.split('/');
        if (oldUrl.length > 2) {
            language = oldUrl[1];
        }
        currentLanguage = language || 'fr';
    }
    applyAccessibilitySettings(userSettings);

    if (!routes[currentLanguage]) {
        history.pushState(null, '', `/${currentLanguage}/404`);
        notFoundView(appDiv);
        return;
    }

    if (!isAuth && !publicRoutes.includes(url)) {
        history.pushState(null, '', '/');
        homeView(appDiv);
    } else {
        if (isAuth && (url === '/login' || url === '/register')) {
            history.pushState(null, '', '/');
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

// Initial load test
navigateTo(location.pathname || '/home');

navigateTo(location.pathname || '/');
