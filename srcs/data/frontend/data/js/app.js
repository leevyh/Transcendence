export const DEBUG = false;

import { chatWS } from './components/chat/functions.js';
import { getCookie, getAccessibility, applyAccessibilitySettings, isAuthenticated } from './views/utils.js';
import { statusSocket } from './views/users.js';
import { statusChatSocket } from './views/chat.js';
import wsManager from "./views/wsManager.js";
import { friends_websocket } from "./views/navigation.js";
import { homeView } from './views/home.js';
import { notFoundView } from './views/404.js';
import { friendsView } from './views/users.js';
import { inGame, pongView, disconnectPlayer } from './views/pong.js';
import { pongSoloView } from './views/pongSolo.js';
import { tournamentView } from './views/tournament.js';
import { profileView } from './views/profile.js';
import { callback42 } from './views/callback42.js';
import { chatView } from './views/chat.js';
import { leaderboardView } from './views/leaderboard.js';
import { menuPongView } from './views/menuPong.js';

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
    '/pongSolo': {
        title: 'Pong Solo',
        view: pongSoloView,
    },
    '/tournament': {
        title: 'Tournament',
        view: tournamentView,
    },
    '/callback42': {
        title: 'Authentification 42',
        view: callback42,
    },
    '/leaderboard': {
        title: 'Leaderboard',
        view: leaderboardView,
    },
    '/menuPong': {
        title: 'menuPong',
        view: menuPongView,
    },
    '/profile': {
        title: 'Profile',
        view: profileView,
    },
};

async function router() {
    const pageTitle = "Transcendence";
    let path = location.pathname;
    if (DEBUG) {console.log(`Navigating to ${path}`);}

    if (chatWS) {chatWS.close();}
    if (inGame) {
        if (DEBUG) {console.log('Disconnecting player in app');}
        disconnectPlayer();
    }

    // If the user is not authenticated and tries to access a private route, redirect to the home page
    const privateRoutes = ['/chat', '/users', '/pong', '/menuPong', '/profile', '/leaderboard'];
    const ProfileRegex = /^\/profile\/([a-zA-Z0-9_-]+)$/; // Regex to match /profile/:user_id
    const match = path.match(ProfileRegex);

    const isPrivateRoute = privateRoutes.includes(path) || match; // Consider profile/:user_id as a private route

    if (isPrivateRoute && await isAuthenticated() === false) {
        if (DEBUG) { console.log(`Trying to access ${path} but user is not authenticated`); }
        path = '/'; // Redirect to 404 if not authenticated
        // Change the URL to the new path
        history.pushState(null, null, path);
    }

    // Get user's accessibility settings
    const userSettings = await getAccessibility();
    if (userSettings) {
        applyAccessibilitySettings(userSettings);
    } else {
        if (DEBUG) console.log('No user settings found');
    }

    // Redirect to '/profile' if the user is authenticated and tries to access the home page
    if (path === '/' && await isAuthenticated() === true) {
        navigateTo('/profile');
        return;
    }
    if (path === '/profile') {
        // Load the current user's profile if no specific ID is provided
        const currentUser = await getCurrentUser();
        document.title = `${pageTitle} | My Profile`;

        history.pushState(null, null, `/profile/${currentUser.id}`);
        profileView(appDiv, currentUser.id);
    } else if (match) {
        // Load a specific user's profile
        const userId = match[1]; // Extract the user ID from the URL
        document.title = `${pageTitle} | User ${userId}'s Profile`;

        appDiv.innerHTML = '';
        profileView(appDiv, userId); // Load the profile view with the specific user ID
    } else {
        // Handle other routes
        const view = routes[path] || routes['/404'];
        document.title = `${pageTitle} | ${view.title}`;
        appDiv.innerHTML = '';
        view.view(appDiv);
    }
}



// Function to navigate to a specific route
export function navigateTo(path) {
    history.pushState(null, null, path);
    if (statusSocket !== null && statusSocket.readyState === WebSocket.OPEN) {
        statusSocket.close();
    }
    if (statusChatSocket !== null && statusChatSocket.readyState === WebSocket.OPEN) {
        statusChatSocket.close();
    }
    if (friends_websocket !== null && friends_websocket.readyState === WebSocket.OPEN && path === '/') {
        friends_websocket.close();
    }
    if (wsManager.socket !== null && wsManager.socket.readyState === WebSocket.OPEN && path === '/') {
        wsManager.socket.close();
    }

    router();
}

// Event listeners for history change and DOM load
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", () => {
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


// Function to get the current user
export async function getCurrentUser() {
    try {
        const response = await fetch('/api/current_user/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (DEBUG) console.log('current user:', data);
            return data;
        }
    } catch (error) {
        if (DEBUG) console.error('Error getting current user:', error);
        return null;
    }
}


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