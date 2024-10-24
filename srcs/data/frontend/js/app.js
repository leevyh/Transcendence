export const DEBUG = true;

import { chatWS } from './components/chat/functions.js';
import { getCookie, getAccessibility, applyAccessibilitySettings, isAuthenticated } from './views/utils.js';

import { homeView } from './views/home.js';
import { notFoundView } from './views/404.js';
import { friendsView } from './views/users.js';
import { pongView } from './views/pong.js';
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
};

async function router() {
    const pageTitle = "Transcendence";
    let path = location.pathname;
    if (DEBUG) {console.log(`Navigating to ${path}`);}

    if (chatWS) {chatWS.close();}

    // If the user is not authenticated and tries to access a private route, redirect to the home page
    const privateRoutes = ['/chat', '/users', '/pong', '/menuPong', '/profile', '/leaderboard'];
    if (privateRoutes.includes(path) && await isAuthenticated() === false) {
        if (DEBUG) {console.log(`Trying to access ${path} but user is not authenticated`);}
        history.pushState(null, null, path); // Change the URL without reloading the page
        path = '/'; // Redirect to the home page
    }

    // Get user's accessibility settings and apply them if they exist
    const userSettings = await getAccessibility();
    if (userSettings) {
        applyAccessibilitySettings(userSettings);
    } else {
        if (DEBUG) console.log('No user settings found');
    }


    // Handle the "/profile" and "/profile/id" paths
    if (path === '/profile') {
        if (await isAuthenticated() === true) {
            // If the user is authenticated, redirect to their own profile
            const currentUser = await getCurrentUser(); // Function to get the current user
            history.pushState(null, null, `/profile/${currentUser.id}`);
            path = `/profile/${currentUser.id}`;
        } else {
            // Redirect to the home page if not authenticated
            path = '/';
        }
    }

    // Check if the URL is a user profile corresponding to /user/:id
    const ProfileRegex = /^\/profile\/([a-zA-Z0-9_-]+)$/; // TODO: Change the regex to take into account the ID
    const profileMatch = path.match(ProfileRegex);

    if (profileMatch) {
        const nickname = profileMatch[1]; // Extraire le pseudo de l'URL

        // Vérifier si l'utilisateur existe
        const user = await findUser(nickname); // Fonction pour trouver l'utilisateur recherché
        if (DEBUG) console.log('User found:', user);
        if (user) {
            document.title = `${pageTitle} | Profil de ${nickname}`;
            appDiv.innerHTML = '';
            profileView(appDiv, user.id); // Afficher la vue de profil de l'utilisateur
        } else {
            // Rediriger vers la page 404 si l'utilisateur n'existe pas
            history.pushState(null, null, '/404');
            path = '/404';
        }
    } else {
        // Gérer les autres routes
        const view = routes[path] || routes['/404'];
        document.title = `${pageTitle} | ${view.title}`;
        appDiv.innerHTML = '';
        view.view(appDiv);
    }
}

// Function to navigate to a specific route
export function navigateTo(path) {
    history.pushState(null, null, path);
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


// isAuthenticated() : vérifier si l'utilisateur est connecté.
// getCurrentUser() : récupérer les informations sur l'utilisateur connecté.
// findUser(nickname) : vérifier si un utilisateur avec ce pseudo existe. --> Utiliser API all_users to check if user exists


async function getCurrentUser() {
    try {
        const response = await fetch('/api/current_user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

// Fonction pour trouver un utilisateur avec le pseudo donné
async function findUser(nickname) {
    fetch(`/api/users/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => response.json())
    .then(users => users.find(user => user.nickname === nickname)) // renvoie l'utilisateur si trouvé
    .catch(error => {
        if (DEBUG) console.error('Error finding user:', error);
        return null;
    });
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