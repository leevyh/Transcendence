import { getCookie } from './utils.js';
import { navigateTo } from './utils.js';

export async function registerView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create elements
    const h1 = document.createElement('h1');
    h1.textContent = 'Register';

    // Créer le conteneur principal
    container.className = 'container';
  
    // Créer la ligne pour centrer le formulaire
    const row = document.createElement('div');
    row.className = 'row justify-content-center';
  
    // Créer la colonne qui contiendra la carte
    const col = document.createElement('div');
    col.className = 'col-md-6';
  
    // Créer la carte
    const card = document.createElement('div');
    card.className = 'card mt-5';
  
    // Créer l'en-tête de la carte
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header text-center';
    cardHeader.innerHTML = '<h2>Inscription</h2>';
  
    // Créer le corps de la carte
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
  
    // Créer le formulaire
    const form = document.createElement('form');
  
    // Champs du formulaire
    const fields = [
      { label: 'Username', type: 'text', id: 'username', placeholder: 'Entrez votre username' },
      { label: 'Nickname', type: 'text', id: 'nickname', placeholder: 'Entrez votre nickname' },
      { label: 'Adresse email', type: 'email', id: 'email', placeholder: 'Entrez votre email' },
      { label: 'Mot de passe', type: 'password', id: 'password', placeholder: 'Entrez un mot de passe' },
      { label: 'Confirmer le mot de passe', type: 'password', id: 'confirmpassword', placeholder: 'Confirmez votre mot de passe' },
    ];
  
    fields.forEach(field => {
      const formGroup = document.createElement('div');
      formGroup.className = 'mb-3';
  
      const label = document.createElement('label');
      label.className = 'form-label';
      label.htmlFor = field.id;
      label.textContent = field.label;
  
      const input = document.createElement('input');
      input.type = field.type;
      input.className = 'form-control';
      input.id = field.id;
      input.placeholder = field.placeholder;
  
      formGroup.appendChild(label);
      formGroup.appendChild(input);
      form.appendChild(formGroup);
    });
  
    // Bouton de soumission
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.className = 'btn btn-primary w-100';
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

        if (password.value !== confirmPassword.value) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Les mots de passe ne correspondent pas!';
            form.insertBefore(errorMessage, submitButton);
            return;
        }

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
                    email: email
                }
            )
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.message === 'User registered successfully') {
                    // alert('Registration successful!');
                    event.preventDefault();
                    navigateTo('/login');
                } else if (data.errors) {
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'text-danger';
                    errorMessage.textContent = 'Erreur lors de l\'inscription: ' + JSON.stringify(data.errors);
                    form.insertBefore(errorMessage, submitButton);
                }
            })
            .catch(error => {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Erreur: ' + error.message;
                form.insertBefore(errorMessage, submitButton);
            });
    });

    cardBody.appendChild(form);
  
    // Créer le pied de page de la carte
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer text-center';
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
    container.appendChild(row);
    document.body.appendChild(container);
}