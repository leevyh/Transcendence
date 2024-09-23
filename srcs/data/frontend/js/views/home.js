import { navigateTo } from '../app.js';
import { changeLanguage } from './utils.js';

export function homeView(container) {
    container.innerHTML = '';

    // Creation d'un div base
    const base = document.createElement('div');
    base.className = 'base';
    container.appendChild(base);

    const h5 = document.createElement('h5');
    h5.className = 'titleWelcome';
    h5.setAttribute('data-i18n', 'home');
    h5.textContent = 'Welcome';
    base.appendChild(h5);

    const divContener = document.createElement('div');
    divContener.className = 'contener';
    base.appendChild(divContener);

    const divCardBody = document.createElement('div');
    divCardBody.className = 'card-body twodivWelcome welcome';
    divContener.appendChild(divCardBody);

    const p = document.createElement('p');
    p.className = 'paragraphWelcome';
    p.setAttribute('data-i18n', 'homeText');
    p.textContent = 'This is our transcendence homepage. This project involves creating a website for the mighty Pong competition! We hope you enjoy your visit to our site.';
    divCardBody.appendChild(p);

    // Creation d'une liste de boutons
    const ul = document.createElement('ul');
    ul.className = 'listButton';
    divCardBody.appendChild(ul);

    const liLogin = document.createElement('li');
    liLogin.className = 'listElemWelcome';
    ul.appendChild(liLogin);

    const buttonLogin = document.createElement('button');
    buttonLogin.className = 'btn btn-primary Buttonselem';
    buttonLogin.setAttribute('data-i18n', 'login');
    buttonLogin.textContent = 'Login'; // Ou 'Sign in'
    buttonLogin.addEventListener('click', (event) => {
        event.preventDefault();
        // navigateTo('/' + choiceLanguage + '/login');
        navigateTo('/login');
    });
    liLogin.appendChild(buttonLogin);

    const liRegister = document.createElement('li');
    liRegister.className = 'listElemWelcome';
    ul.appendChild(liRegister);

    const buttonRegister = document.createElement('button');
    buttonRegister.className = 'btn btn-primary Buttonselem';
    buttonRegister.setAttribute('data-i18n', 'register');
    buttonRegister.textContent = 'Register'; // Ou 'Sign up'
    buttonRegister.addEventListener('click', (event) => {
        event.preventDefault();
        // navigateTo('/' + choiceLanguage + '/register');
        navigateTo('/register');
    });
    liRegister.appendChild(buttonRegister);

    // Image de pong
    const img = document.createElement('img');
    img.setAttribute('src', '/assets/pong.png');
    img.setAttribute('alt', 'Pong');

    img.className = 'object-fit-fill border rounded twodivWelcome imgLogin';
    divContener.appendChild(img);

    // SELECTEUR DE LANGUE
    const languageDiv = document.createElement('div');
    languageDiv.id = 'language';

    const languageLabel = document.createElement('label');
    languageLabel.htmlFor = 'language-selector';
    languageLabel.setAttribute('data-i18n', 'language_selector');
    languageLabel.textContent = 'Language: ';
    languageLabel.className = 'languageLabel';
    languageDiv.appendChild(languageLabel);

    const languageSelector = document.createElement('select');
    languageSelector.id = 'language-selector';

    const optionEn = document.createElement('option');
    optionEn.value = 'en';
    optionEn.innerHTML = '🇬🇧';

    const optionFr = document.createElement('option');
    optionFr.value = 'fr';
    optionFr.innerHTML = '🇫🇷';

    const optionEs = document.createElement('option');
    optionEs.value = 'sp';
    optionEs.innerHTML = '🇪🇸';

    languageSelector.appendChild(optionEn);
    languageSelector.appendChild(optionFr);
    languageSelector.appendChild(optionEs);
    languageDiv.appendChild(languageSelector);
    base.appendChild(languageDiv);

    let choiceLanguage = 'en';
    document.querySelector("#language-selector").addEventListener("change", function() {
        choiceLanguage = this.value;
        changeLanguage(choiceLanguage);
    });
}