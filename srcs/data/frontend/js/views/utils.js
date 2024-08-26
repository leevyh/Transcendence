import { homeView } from './home.js';
import { registerView } from './register.js';
import { loginView } from './login.js';
import { settingsView } from './settings.js';
import { notFoundView } from './404.js';
import { chatView } from './chat.js';

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

export function navigateTo(url) {
    // Update the URL in the address bar
    history.pushState(null, null, url);

    // Handle the route change
    handleRouteChange();
}

function handleRouteChange() {
    const path = window.location.pathname;
    const container = document.getElementById('app');

    if (path === '/login') {
        loginView(container);
    } else if (path === '/') {
        homeView(container);
    } else if (path === '/register') {
        registerView(container);
    } else if (path === '/settings') {
        settingsView(container);
    } else if (path === '/chat') {
        chatView(container);
    } else {
        notFoundView(container);
    }
    // Ajoute d'autres routes ici si nécessaire
}