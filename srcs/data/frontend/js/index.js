import Dashboard from "./views/Dashboard.js";
import Pong from "./views/pong/Pong.js";
import Settings from "./views/Settings.js";
import NotFound from "./views/404.js";
import SignIn from "./views/Sign-in.js";

const navigateTo = url => {
	  history.pushState(null, null, url);
	  router();
};

const router = async () => {
  const routes = [
	{ path: "/", view: Dashboard },
	{ path: "/pong", view: Pong },
	{ path: "/settings", view: Settings },
	{ path: "/404", view: NotFound },
	{ path: "/sign-in", view: SignIn },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map(route => {
	return {
	  route: route,
	  isMatch: location.pathname === route.path
	};
  });

  let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

  // If no route is found, default to the 404 page
  if (!match) {
	match = {
	  route: routes.find(route => route.path === "/404"),
	  isMatch: true
	};
  }

  const view = new match.route.view();

  // This line updates the page content without a full page reload
  document.querySelector("#app").innerHTML = await view.getHtml();
};

// Ajoutez un écouteur d'événements pour le chargement de la page
window.addEventListener("load", router);

// Ajoutez des écouteurs d'événements pour les changements d'état de l'historique
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	// Ajoutez des écouteurs d'événements pour les liens de navigation
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});

	// Ajoutez un écouteur d'événements pour le sélecteur de langue
	document.querySelector("#language-selector").addEventListener("change", function() {
			changeLanguage(this.value);
	});
	router();
});

const translations = {
	en: {
	  // Dashboard page
	  welcome: "Welcome, Dom!",
	  // Pong page
	  pong: "There will be a Pong Game here soon!",
	  // Settings page
	  settings: "Settings",
	  settings_txt: "Manage your privacy and configuration settings.",
	  // Sign-in page
	  signin: "Please sign in",
	  email: "Email address",
	  password: "Password",
	  remember: "Remember me",
	  sign: "Sign in",
	  sign42: 'Sign in with ',
	  // other translations...
	},
	fr: {
	  // Dashboard page
	  welcome: "Bienvenue, Dom!",
	  // Pong page
	  pong: "Il y aura bientôt un jeu de Pong ici!",
	  // Settings page
	  settings: "Paramètres",
	  settings_txt: "Gérez vos paramètres de confidentialité et de configuration.",
	  // Sign-in page
	  signin: "Veuillez vous connecter",
	  email: "Adresse e-mail",
	  password: "Mot de passe",
	  remember: "Se souvenir de moi",
	  sign: "Se connecter",
	  sign42: 'Se connecter avec ',
	  // other translations...
	},
	es: {
	  // Dashboard page
	  welcome: "Bienvenido, Dom!",
	  // Pong page
	  pong: "¡Pronto habrá un juego de Pong aquí!",
	  // Settings page
	  settings: "Ajustes",
	  settings_txt: "Administre su configuración y privacidad.",
	  // Sign-in page
	  signin: "Por favor inicie sesión",
	  email: "Correo electrónico",
	  password: "Contraseña",
	  remember: "Recuérdame",
	  sign: "Iniciar sesión",
	  sign42: 'Iniciar sesión con ',
	  // other translations...
	},
};

function changeLanguage(lang) {
	const elements = document.querySelectorAll("[data-i18n]");
	elements.forEach(element => {
	  const key = element.getAttribute("data-i18n");
	  const translation = translations[lang][key];
	
	  if (translation) {
		element.childNodes[0].nodeValue = translation;
	  }
	});
}

var imagejavascript = document.createElement("img")

imagejavascript.src = "/js/img/42_logo_white.svg"
