import { getCookie } from '../utils.js';
import { navigateTo } from '../../app.js';

export async function registerView(container) {
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
        navigateTo('/');
    });

    ////////////////////////////////////////////////////

    const h1 = document.createElement('h1');
    h1.textContent = 'Inscription';

    // Créer le conteneur principal
    container.className = 'containerRegister';

    const background = document.createElement('div')
    background.className = 'background';
    container.appendChild(background);

    // Créer la ligne pour centrer le formulaire
    const row = document.createElement('div');
    row.className = 'row justify-content-center rowRegister';

    const contenerImgRegister = document.createElement('div');
    contenerImgRegister.className = 'contenerImgRegister';


    background.appendChild(contenerImgRegister);


    const ImgRegister = document.createElement('img');
    ImgRegister.setAttribute('src', '/assets/login0.png');
    ImgRegister.setAttribute('alt', 'Register');

    ImgRegister.className = 'object-fit-fill imgLogin';
    contenerImgRegister.appendChild(ImgRegister);


    // Créer la colonne qui contiendra la carte
    const col = document.createElement('div');
    col.className = 'col-md-6 DivMainRegister';

    // Créer la carte
    const card = document.createElement('div');
    card.className = 'card mt-5 cardRegister';

    // Créer l'en-tête de la carte
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header text-center titleRegister';
    cardHeader.innerHTML = '<h2>Inscription</h2>';

    // Créer le corps de la carte
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body cardbodyRegister';

    // Créer le formulaire
    const form = document.createElement('form');

    // Champs du formulaire
    const fields = [
        { label: 'Nom d\'utilisateur' , type: 'text', id: 'username', placeholder: 'Entrez votre nom d\'utilisateur' },
        { label: 'Pseudo', type: 'text', id: 'nickname', placeholder: 'Entrez votre pseudo' },
        { label: 'Adresse email', type: 'email', id: 'email', placeholder: 'Entrez votre email' },
        { label: 'Mot de passe', type: 'password', id: 'password', placeholder: 'Entrez un mot de passe' },
        { label: 'Confirmer le mot de passe', type: 'password', id: 'confirmpassword', placeholder: 'Confirmez votre mot de passe' },
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
    submitButton.setAttribute('type', 'submit');
    submitButton.className = 'btn btn-primary w-100 ButtonRegister';
    submitButton.textContent = "S'inscrire";
    form.appendChild(submitButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Suppression des messages d'erreur précédents
        const errorMessages = form.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());

        // Récupérer les valeurs des champs ajoutés dans le formulaire
        const username = document.getElementById('username').value;
        const nickname = document.getElementById('nickname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmpassword').value;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
        // Si un champ est vide
        if (!username || !nickname || !email || !password || !confirmPassword) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Tous les champs sont obligatoires';
            form.insertBefore(errorMessage, submitButton);
            return;
        }
        // Si les mots de passe ne correspondent pas
        else if (password !== confirmPassword) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Les mots de passe ne correspondent pas';
            form.insertBefore(errorMessage, submitButton);
            return;
        }
        // Si le nouveau mot de passe a la bonne forme
        // else if (!passwordRegex.test(password)) {
        //     const errorMessage = document.createElement('p');
        //     errorMessage.className = 'text-danger';
        //     errorMessage.textContent = 'Le mot de passe doit contenir entre 8 et 12 caractères, au moins une lettre majuscule, une lettre minuscule et un chiffre';
        //     form.insertBefore(errorMessage, submitButton);
        //     return;
        // }


        // Si la langue est deja dans l'url, on la recupere
        let url = window.location.pathname;
        let language = null;
        const splitPath = url.split('/');
        if (splitPath.length > 2) {
            url = `/${splitPath[2]}`;
            language = splitPath[1];
        }

        // Envoi des données du formulaire
        fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(
                {
                    username: username,
                    password: password,
                    nickname: nickname,
                    email: email,
                    language: language
                }
            )
        })
            .then(response => {
                if (!response.ok) {
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'text-danger';
                    errorMessage.textContent = 'Erreur lors de l\'inscription, veuillez réessayer';
                    form.insertBefore(errorMessage, submitButton);
                }
                else {
                    event.preventDefault();
                    navigateTo('/login');
                }
            })
            .catch(error => {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Erreur lors de l\'inscription, veuillez réessayer';
                form.insertBefore(errorMessage, submitButton);
            });
    });

    cardBody.appendChild(form);

    // Créer le pied de page de la carte
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer text-center FooterRegister';
    cardFooter.innerHTML = '<small>Déjà un compte ? <a href="#" id="loginLink">Connectez-vous</a></small>';

    // Ajouter un gestionnaire d'événements au lien
    cardFooter.querySelector('#loginLink').addEventListener('click', function(event) {
        event.preventDefault();
        navigateTo('/login');
    });

    // Assembler les éléments
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);
    col.appendChild(card);
    row.appendChild(col);
    contenerImgRegister.appendChild(row);
    document.body.appendChild(container);
}
