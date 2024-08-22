import { homeView } from './views/home.js';
import { registerView } from './views/register.js';
import { loginView } from './views/login.js';
import { settingsView } from './views/settings.js';
import { notFoundView } from './views/404.js';
import { chatView } from './views/chat3.js';
import { passwordView } from './views/password.js';

const appDiv = document.getElementById('app');

const routes = {
    '/': homeView,
    '/register': registerView,
    '/login': loginView,
    '/settings': settingsView,
    // '/profile': profileView,
    '/404': notFoundView,
    '/chat': chatView,
    '/password': passwordView,
};

function navigateTo(view) {
    appDiv.innerHTML = '';
    const viewFunction = routes[view] || notFoundView;
    viewFunction(appDiv);
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