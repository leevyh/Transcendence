import { getCookie } from '../utils.js';
import { navigateTo } from '../../app.js';

export function loginView(container) {
    container.innerHTML = '';

    // Creation d'une barre de navigation
    const nav = document.createElement('nav');
    nav.className = 'navbar fixed-top bg-body-tertiary';
    container.appendChild(nav);

    const containerFluid = document.createElement('div');
    containerFluid.className = 'container-fluid';
    nav.appendChild(containerFluid);

    const aHome = document.createElement('a');
    aHome.className = 'navbar-brand homesvg';
    containerFluid.appendChild(aHome);

    const svgHome = document.createElement('svg');
    svgHome.className = 'svgHome';
    svgHome.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgHome.setAttribute('width', '30');
    svgHome.setAttribute('height', '24');
    svgHome.setAttribute('fill', 'currentColor');
    svgHome.setAttribute('class', 'bi bi-house-door-fill');
    svgHome.setAttribute('viewBox', '0 0 16 16');

    aHome.appendChild(svgHome);
    svgHome.addEventListener('click', () => {
        navigateTo('/home');
    });



    const h1 = document.createElement('h1');
    h1.textContent = 'Connexion';

    container.className = 'containerRegister';

    // Créer la ligne pour centrer le formulaire
    const row = document.createElement('div');
    row.className = 'row justify-content-center rowRegister';

    // Créer la colonne qui contiendra la carte
    const col = document.createElement('div');
    col.className = 'col-md-4 DivMainRegister';

    // Créer la carte
    const card = document.createElement('div');
    card.className = 'card mt-5 cardRegister';

    // Créer l'en-tête de la carte
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header text-center titleRegister';
    cardHeader.innerHTML = '<h2>Connexion</h2>';

    // Créer le corps de la carte
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body cardbodyRegister';

    // Créer le formulaire
    const form = document.createElement('form');

    // Champs du formulaire
    const fields = [
      { label: 'Nom d\'utilisateur', type: 'username', id: 'username', placeholder: 'Entrez votre nom d\'utilisateur' },
      { label: 'Mot de passe', type: 'password', id: 'password', placeholder: 'Entrez votre mot de passe' },
    ];

    fields.forEach(field => {
      const formGroup = document.createElement('div');
      formGroup.className = 'mb-3';

      const label = document.createElement('label');
      label.className = 'form-label titleLabelRegister';
      label.htmlFor = field.id;
      label.textContent = field.label;

      const input = document.createElement('input');
      input.type = field.type;
      input.className = 'form-control FormChamp';
      input.id = field.id;
      input.placeholder = field.placeholder;

      formGroup.appendChild(label);
      formGroup.appendChild(input);
      form.appendChild(formGroup);
    });

    // Bouton de soumission
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary w-100 Buttonselem';
    submitButton.textContent = 'Se connecter';
    form.appendChild(submitButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Suppression des messages d'erreur précédents
        const errorMessages = form.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Tous les champs sont obligatoires';
            form.insertBefore(errorMessage, submitButton);
            return;
        }
        fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ login: username, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User logged in successfully') {
                localStorage.setItem('token', data.token);
                event.preventDefault();
                navigateTo('/');
            } else if (data.error) {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Mauvais mot de passe ou nom d\'utilisateur, veuillez réessayer';
                form.insertBefore(errorMessage, submitButton);
            }
        })
        .catch(error => {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
            form.insertBefore(errorMessage, submitButton);
        });
    });
    cardBody.appendChild(form);

    // Créer le pied de page de la carte
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer text-center FooterRegister';
    cardFooter.innerHTML = '<small>Pas encore de compte ? <a href="#" id="registerLink">Inscrivez-vous</a></small>';

    // Ajouter un gestionnaire d'événements au lien
    cardFooter.querySelector('#registerLink').addEventListener('click', function(event) {
        event.preventDefault();
        navigateTo('/register');
    });

    document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            fetch('/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ code: code })
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // console.log(data);
                    navigateTo('/settings');
                }
                else {
                    // console.log('No data');
                }
            })
            .catch(error => {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
                form.insertBefore(errorMessage, submitButton);
            });
            }
        });

    // Connexion avec 42
    const cardLogin42 = document.createElement('div');
    cardLogin42.className = 'card-footer text-center';

    const login42Button = document.createElement('button');
    login42Button.type = 'button';
    login42Button.className = 'btn btn-dark w-100 Buttonselem';
    login42Button.textContent = 'Se connecter avec 42';
    cardLogin42.appendChild(login42Button);
    cardLogin42.addEventListener('click', (event) => {
        event.preventDefault();

        // Suppression des messages d'erreur précédents
        const errorMessages = form.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());

        fetch('/api/auth/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            if (data.url) {
                // console.log(data.url);
                window.location.href = data.url;
            } else if (data.error) {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
                form.insertBefore(errorMessage, submitButton);
            }
        })
        .catch(error => {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
            form.insertBefore(errorMessage, submitButton);
        });
    });

    // Assembler les éléments
    card.appendChild(cardLogin42);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);
    col.appendChild(card);
    row.appendChild(col);
    container.appendChild(row);
    document.body.appendChild(container);
}
