import { homeView } from './views/home.js';
import { registerView } from './views/register.js';
import { loginView } from './views/login.js';
import { settingsView } from './views/settings.js';
import { notFoundView } from './views/404.js';
import { chatView } from './views/chat.js';
import { passwordView } from './views/password.js';
import { getCookie } from './views/utils.js';

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

async function navigateTo(view) {
    const isAuth = await isAuthenticated();
    const publicRoutes = ['/login', '/register', '/404'];

    if (!isAuth && !publicRoutes.includes(view)) {
        console.log(isAuth);
        history.pushState(null, '', '/');
        homeView(appDiv);
    } else {
        console.log(isAuth);
        //don't go in login or register if already logged in
        if (isAuth && (view === '/login' || view === '/register')) {
            history.pushState(null, '', '/');
            homeView(appDiv);
            return;
        }
        appDiv.innerHTML = '';
        const viewFunction = routes[view] || notFoundView;
        viewFunction(appDiv);
        history.pushState(null, '', view);
    }
}

// async function navigateTo(view) {
//     const isAuth = await isAuthenticated();
//     const publicRoutes = ['/login', '/register', '/404'];

//     if (!isAuth && !publicRoutes.includes(view)) {
//         console.log(isAuth);
//         history.pushState(null, '', '/');
//         appDiv.innerHTML = homeView(appDiv); // Insert HTML into appDiv
//     } else {
//         console.log(isAuth);
//         // Don't go to login or register if already logged in
//         if (isAuth && (view === '/login' || view === '/register')) {
//             history.pushState(null, '', '/');
//             appDiv.innerHTML = homeView(appDiv); // Insert HTML into appDiv
//             return;
//         }
//         appDiv.innerHTML = '';
//         const viewFunction = routes[view] || notFoundView;
//         appDiv.innerHTML = viewFunction(appDiv); // Insert HTML into appDiv
//         history.pushState(null, '', view);
//     }
// }


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
