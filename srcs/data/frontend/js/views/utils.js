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

const translations = {
	en: {
		// Home page
		home: "Home page",
		welcome: "Welcome to the home page!",
		login: "Log in",
		register: "Register",
		logout: "Log out",
		settings: "Settings",
	},
	fr: {
		// Home page
		home: "Page d'accueil",
		welcome: "Bienvenue sur la page d'accueil!",
		login: "Se connecter",
		register: "S'inscrire",
		logout: "Se déconnecter",
		settings: "Paramètres",
	},
	sp: {
		// Home page
		home: "Página de inicio",
		welcome: "¡Bienvenido a la página de inicio!",
		login: "Iniciar sesión",
		register: "Registrarse",
		logout: "Cerrar sesión",
		settings: "Ajustes",
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

// Récupérer le token CSRF depuis les cookies et vérifier si l'utilisateur est authentifié
export async function isAuthenticated() {
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
            return data.value;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Récupérer les paramètres d'accessibilité de l'utilisateur
export async function getAccessibility() {
    try {
        const response = await fetch('/api/settings/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const userData = {
            language: data.language,
            font_size: data.font_size,
            theme: data.dark_mode,
        };
        console.log('data:', userData);
        return userData;
    } catch (error) {
        console.error('Error retrieving settings:', error);
        return null;
    }
}

export function applyAccessibilitySettings(userSettings) {
    const rootElement = document.documentElement;
    if (!userSettings) {
        document.documentElement.setAttribute('lang', 'fr');
        rootElement.style.fontSize = '16px';
        document.body.classList.remove('dark-mode');
        return;
    }

    // Appliquer le langage
    if (userSettings.language) {
        document.documentElement.setAttribute('lang', userSettings.language);
    }

    // Appliquer la taille de police
    switch (userSettings.font_size) {
        case 1:
            rootElement.style.fontSize = '12px';
            break;
        case 2:
            rootElement.style.fontSize = '16px'; // Taille par défaut
            break;
        case 3:
            rootElement.style.fontSize = '20px';
            break;
        default:
            rootElement.style.fontSize = '16px'; // Valeur par défaut
    }

    // Appliquer le mode sombre
    if (userSettings.theme) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}