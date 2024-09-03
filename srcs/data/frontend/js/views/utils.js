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

export function changeLanguage(lang) {
	console.log('lang:', lang);
	const elements = document.querySelectorAll('[data-i18n]');
	elements.forEach(element => {
		const key = element.getAttribute('data-i18n');
		const translation = translations[lang][key];

		if (translation) {
			element.childNodes[0].nodeValue = translation;
		}
	});
}