export const DEBUG = true;

import { chatWS } from './component/chat/functions.js';
import { getAccessibility, applyAccessibilitySettings } from './views/utils.js';

import { homeView } from './views/home.js';
import { notFoundView } from './views/404.js';
import { friendsView } from './views/users.js';
import { pongView } from './views/pong.js';
import { profileView } from './views/profile.js';
import { callback42 } from './views/callback42.js';
import { chatView } from './views/chat.js';
import { leaderboardView } from './views/leaderboard.js';


const appDiv = document.getElementById('app');

const routes = {
    '/': {
        title: 'Home',
        view: homeView,
    },
    '/404': {
        title: '404',
        view: notFoundView,
    },
    '/chat': {
        title: 'Chat',
        view: chatView,
    },
    '/users': {
        title: 'Users',
        view: friendsView,
    },
    '/pong': {
        title: 'Pong',
        view: pongView,
    },
    '/callback42': {
        title: 'Authentification 42',
        view: callback42,
    },
    '/leaderboard': {
        title: 'Leaderboard',
        view: leaderboardView,
    },
};

async function router() {
    if (DEBUG) console.log('Router');
    const pageTitle = "Transcendence";
    let path = location.pathname;
    
    if (chatWS) {chatWS.close();}

    // Check if the URL is a user profile corresponding to /user/:nickname
    const userProfileRegex = /^\/user\/([a-zA-Z0-9_-]+)$/;
    const match = path.match(userProfileRegex);

    // Get user's accessibility settings
    const userSettings = await getAccessibility();
    if (userSettings) {
        applyAccessibilitySettings(userSettings);
    }
    else {
        if (DEBUG) console.log('No user settings found');
    }

    if (match) {
        const nickname = match[1]; // Extract the nickname from the URL
        document.title = `${pageTitle} | ${nickname}'s profile`;

        appDiv.innerHTML = '';
        profileView(appDiv, nickname);
    } else {
        const view = routes[path] || routes['/404'];
        document.title = `${pageTitle} | ${view.title}`;
        appDiv.innerHTML = '';
        view.view(appDiv);
    }
}

export function navigateTo(path) {
    if (DEBUG) console.log('Navigating to', path);
    history.pushState(null, null, path);
    router();
}

window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", () => {
    if (DEBUG) console.log('DOMContentLoaded');
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            const href = e.target.getAttribute("href");
            navigateTo(href);
            return;
        }
    });
    router();
});


// OLD METHOD FOR MULTILANGUAGE
// import { getAccessibility, applyAccessibilitySettings } from './views/utils.js';
// const routes = {
//     'en': {
//         '/': homeView,
//         '/login': loginView,
//         '/register': registerView,
//         '/settings': settingsView,
//         '/password': passwordView,
//         '/friends' : friendsView,
//         '/chat': chatView,
//         '/pong': pongView,
//     },
//     'fr': {},
//     'sp': {}
// };

// export async function navigateTo(url) {
//     if (ChatWS) {ChatWS.close();}

//     const isAuth = await isAuthenticated();
//     const publicRoutes = ['/login', '/register', '/404'];

//     let currentLanguage = null;
//     let language = null;

//     const splitPath = url.split('/');
//     let userSettings = null;

//     if (isAuth === true) {
//         if (splitPath.length > 2) {
//             url = `/${splitPath[2]}`;
//         }
//         userSettings = await getAccessibility();
//         if (userSettings) {
//             language = `${userSettings.language}`;
//         }
//     } else {
//         if (splitPath.length > 2) {
//             url = `/${splitPath[2]}`;
//             language = splitPath[1];
//         }
//         const oldUrl = location.pathname.split('/');
//         if (oldUrl.length > 2) {
//             language = oldUrl[1];
//         }
//     }
//     currentLanguage = language || 'en';
//     applyAccessibilitySettings(userSettings);

//     if (!routes[currentLanguage]) {
//         history.pushState(null, '', `/${currentLanguage}/404`);
//         notFoundView(appDiv);
//         return;
//     }

//     if (!isAuth && !publicRoutes.includes(url)) {
//         history.pushState(null, '', '/');
//         homeView(appDiv);
//     } else {
//         if (isAuth && (url === '/login' || url === '/register')) {
//             history.pushState(null, '', '/');
//             homeView(appDiv);
//             return;
//         }
//         appDiv.innerHTML = '';
//         const viewFunction = routes[currentLanguage][url] || notFoundView;
//         viewFunction(appDiv);
//         history.pushState(null, '', `/${currentLanguage}${url}`);
//     }
// }

// window.addEventListener('popstate', () => {
//     navigateTo(location.pathname);
// });

// // Initial load test
// navigateTo(location.pathname || '/home');
