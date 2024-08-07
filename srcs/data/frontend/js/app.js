import { homeView } from './views/home.js';
import { registerView } from './views/register.js';
import { loginView } from './views/login.js';
import { profileView } from './views/profile.js';
import { notFoundView } from './views/404.js';

const appDiv = document.getElementById('app');

const routes = {
    '/': homeView,
    '/register': registerView,
    '/login': loginView,
    '/profile': profileView,
    '/404': notFoundView,
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