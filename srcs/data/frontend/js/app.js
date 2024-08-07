// app.js
import { homeView } from './views/home.js';
import { registerView } from './views/register.js';
import { loginView } from './views/login.js';
import { profileView } from './views/profile.js';
import { notFoundView } from './views/404.js';

const appDiv = document.getElementById('app');

const routes = {
    home: homeView,
    register: registerView,
    login: loginView,
    profile: profileView,
    404: notFoundView,
};

function navigateTo(view) {
    appDiv.innerHTML = '';
    const viewFunction = routes[view] || notFoundView;
    viewFunction(appDiv);
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const view = event.target.getAttribute('data-link');
        history.pushState(null, '', `#${view}`);
        navigateTo(view);
    });
});

window.addEventListener('popstate', () => {
    const view = location.hash.replace('#', '') || 'home';
    navigateTo(view);
});

// Initial load
const initialView = location.hash.replace('#', '') || 'home';
navigateTo(initialView);
