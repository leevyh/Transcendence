import { DEBUG, navigateTo } from '../app.js';
import wsManager from './wsManager.js';
import {
    readNotification,
    decrementNotificationCount,
    removeNotification,
} from "./notifications.js";

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
}

const translations = {
	en: {
		// Home page
		home: 'Welcome',
		homeText: 'This is our transcendence homepage. This project involves creating a website for the mighty Pong competition! We hope you enjoy your visit to our site.',
		login: "Login",
		register: "Register",
		logout: "Log out",
		settings: "Settings",
        language_selector: "Language: ",
	},
	fr: {
		// Home page
		home: 'Bienvenue',
		homeText: 'Voici notre page d\'accueil transcendance. Ce projet consiste en la création d\'un site web pour le concours « Pong » ! Nous espérons que vous apprécierez votre visite sur notre site',
		login: "Se connecter",
		register: "S'inscrire",
		logout: "Se déconnecter",
		settings: "Paramètres",
        language_selector: "Langue: ",
	},
	sp: {
		// Home page
		home: '¡Bienvenido!',
		homeText: 'Esta es nuestra página web de trascendencia. Este proyecto consiste en crear un sitio web para la poderosa competición Pong. Esperamos que disfrute de su visita a nuestro sitio.',
		login: "Iniciar sesión",
		register: "Registrarse",
		logout: "Cerrar sesión",
		settings: "Ajustes",
        language_selector: "Idioma: ",
	},
};

// Change the language of the page
export function changeLanguage(lang) {
	const elements = document.querySelectorAll('[data-i18n]');
	elements.forEach(element => {
		const key = element.getAttribute('data-i18n');
		const translation = translations[lang][key];

		if (translation) {
			element.childNodes[0].nodeValue = translation;
		}
	});
}

wsManager.AddNotificationListener((data) => {
        displayToast(data);
})

export function displayToast(data) {
    let toast_container = document.querySelector('.toast-container');


    // Si le conteneur n'existe pas, le créer
    if (!toast_container) {
        toast_container = document.createElement('div');
        toast_container.className = 'toast-container  position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toast_container);
    }

    // Limite de toasts
    const maxToasts = 3;
    const currentToasts = toast_container.querySelectorAll('.toast');

    // Si le nombre de toasts dépasse la limite, supprimer le plus ancien
    if (currentToasts.length >= maxToasts) {
        currentToasts[0].remove();
    }

    // Création d'un nouvel élément de toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    const toast_header = document.createElement('div');
    toast_header.className = 'toast-header';

    if (data.error)
    {
        //Friends request already sent avatar replace by error icon
        const error_icon = document.createElement('i');
        error_icon.className = 'bi bi-exclamation-triangle-fill';
        error_icon.style = 'color: red;';
        toast_header.appendChild(error_icon);

        const strong = document.createElement('strong');
        strong.className = 'me-auto';
        strong.textContent = 'Error';

        toast_header.appendChild(strong);

        const button = document.createElement('button');
        button.className = 'btn-close';
        button.setAttribute('data-bs-dismiss', 'toast');
        button.setAttribute('aria-label', 'Close');
        button.addEventListener('click', () => {
            toast.remove();
        });

        toast_header.appendChild(button);


        toast.appendChild(toast_header);

        const toast_body = document.createElement('div');
        toast_body.className = 'toast-body';
        toast_body.textContent = data.error;

        toast.appendChild(toast_body);

        toast_container.appendChild(toast);

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        return;
    }

    if (data.type === 'new_message' || data.type === 'friend_request') {
        const avatar_user_sender = document.createElement('img');
        avatar_user_sender.className = 'rounded me-2 user-img';
        avatar_user_sender.src = `data:image/png;base64, ${data.from_avatar}`;
        avatar_user_sender.alt = 'avatar';
        toast_header.appendChild(avatar_user_sender);

        const strong = document.createElement('strong');
        strong.className = 'me-auto';
        strong.textContent = data.from_nickname;
        toast_header.appendChild(strong);

        const button = document.createElement('button');
        button.className = 'btn-close';
        button.setAttribute('data-bs-dismiss', 'toast');
        button.setAttribute('aria-label', 'Close');
        button.addEventListener('click', () => {
            readNotification(data.id).then(() =>
            {
                return;
            });
            decrementNotificationCount();
            toast.remove();
        });
        toast_header.appendChild(button);

        toast.appendChild(toast_header);
    }
    else {
        return;
    }

    // Gestion du type de notification
    if (data.type === 'new_message') {
        const toast_body = document.createElement('div');
        toast_body.className = 'toast-body';
        toast_body.textContent = data.message;
        toast.appendChild(toast_body);
    } else if (data.type === 'friend_request') {
        const toast_body = document.createElement('div');
        toast_body.className = 'toast-body';
        toast_body.textContent = `${data.from_nickname} sent you a friend request`;
        toast.appendChild(toast_body);

        const div_buttons = document.createElement('div');
        div_buttons.className = 'd-grid gap-2 d-md-flex justify-content-md-center';
        toast.appendChild(div_buttons);

        const accept_button = document.createElement('button');
        accept_button.className = 'btn btn-success';
        accept_button.textContent = 'Accept';
        accept_button.addEventListener('click', () => {
            removeNotification(data.id);
            decrementNotificationCount();
            wsManager.send({
                type: 'accept_friend_request',
                nickname: data.from_nickname,
            });
            toast.remove();
        });
        div_buttons.appendChild(accept_button);

        const reject_button = document.createElement('button');
        reject_button.className = 'btn btn-danger';
        reject_button.textContent = 'Reject';
        reject_button.addEventListener('click', () => {
            removeNotification(data.id);
            decrementNotificationCount();
            wsManager.send({
                type: 'reject_friend_request',
                nickname: data.from_nickname,
            });
            toast.remove();
        });
        div_buttons.appendChild(reject_button);
    }
    else {
        return ;
    }

    // Ajouter le toast au conteneur
    toast_container.appendChild(toast);

    // Activer le toast avec Bootstrap
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Récupérer le token CSRF depuis les cookies et vérifier si l'utilisateur est authentifié
export async function isAuthenticated() {
    try {
        const response = await fetch('/api/check_auth/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (data.value === true) {return true;}
            else {return false;}
        }
    }
    catch (error) {
        if (DEBUG) {console.error('Error checking authentication:', error);}
        return false;
    }
}

// Récupérer les paramètres d'accessibilité de l'utilisateur
export async function getAccessibility() {
    if (await isAuthenticated() === true) {
        if (DEBUG) {console.log('User is authenticated');}
        try {
            const response = await fetch('/api/settings/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                const userData = {
                    language: data.language,
                    font_size: data.font_size,
                };
                return userData;
            } else if (response.status === 307) {
                // Means the token is invalid, so we remove it from localStorage and redirect to the home page
                localStorage.removeItem('token');

                const logoutResponse = await fetch('/api/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                });

                await logoutResponse.json();
                navigateTo('/');
                return null;
            }
        } catch (error) {
            if (DEBUG) {console.error('Error fetching accessibility settings:', error);}
            return null;
        }
    } else {
        if (DEBUG) {console.log('User is not authenticated');}
        return null;
    }
}

export function applyAccessibilitySettings(userSettings) {
    const bodyElement = document.body;
    if (!userSettings) {
        document.documentElement.setAttribute('lang', 'fr');
        bodyElement.style.fontSize = '16px';
        return;
    }
    if (DEBUG) {console.log('User settings:', userSettings);}

    // Apply the font size
    switch (userSettings.font_size) {
        case 1:
            bodyElement.style.fontSize = '12px';
            break;
        case 2:
            bodyElement.style.fontSize = '16px';
            break;
        case 3:
            bodyElement.style.fontSize = '20px';
            break;
        default:
            bodyElement.style.fontSize = '16px'; // Default value
    }

    // TODO: Apply the language
    if (userSettings.language) {
        document.documentElement.setAttribute('lang', userSettings.language);
    }
}
