import { getCookie } from './utils.js';
import { navigateTo } from './utils.js';

export function loginView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create elements
    const h1 = document.createElement('h1');
    h1.textContent = 'Login';
    
    //if already logged in, redirect to setting page
    if (localStorage.getItem('isLoggedIn') === 'true') {
        navigateTo('/settings');
        return ;
    }

    // Créer le conteneur principal
    container.className = 'container';
  
    // Créer la ligne pour centrer le formulaire
    const row = document.createElement('div');
    row.className = 'row justify-content-center';
  
    // Créer la colonne qui contiendra la carte
    const col = document.createElement('div');
    col.className = 'col-md-4';
  
    // Créer la carte
    const card = document.createElement('div');
    card.className = 'card mt-5';
  
    // Créer l'en-tête de la carte
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header text-center';
    cardHeader.innerHTML = '<h2>Connexion</h2>';
  
    // Créer le corps de la carte
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
  
    // Créer le formulaire
    const form = document.createElement('form');
  
    // Champs du formulaire
    const fields = [
      { label: 'Username', type: 'username', id: 'username', placeholder: 'Entrez votre username' },
      { label: 'Mot de passe', type: 'password', id: 'password', placeholder: 'Entrez votre mot de passe' },
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
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary w-100';
    submitButton.textContent = 'Se connecter';
  
    form.appendChild(submitButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
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
                localStorage.setItem('username', username);
                localStorage.setItem('isLoggedIn', 'true');  // A supprimer plus tard pour eviter conflic avec le backend
                event.preventDefault();
                navigateTo('/settings'); // Redirect to profile page
            } else if (data.error) {
                // Afficher un message d'erreur "Bad password or username, please try again"
                alert('Bad password or username, please try again');
                // alert(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });

    cardBody.appendChild(form);
  
    // Créer le pied de page de la carte
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer text-center';
    cardFooter.innerHTML = '<small>Pas encore de compte ? <a href="#" id="registerLink">Inscrivez-vous</a></small>';

    // Ajouter un gestionnaire d'événements au lien
    cardFooter.querySelector('#registerLink').addEventListener('click', function(event) {
        event.preventDefault();
        navigateTo('/register');
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