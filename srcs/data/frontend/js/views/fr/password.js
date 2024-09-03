import { getCookie } from '../utils.js';
import { navigateTo } from '../../app.js';

export function passwordView(container) {
    container.innerHTML = '';

    const pageTitle = document.createElement('h2');
    pageTitle.className = 'text-center mb-4';
    pageTitle.textContent = 'Modification de Mot de Passe';
    container.appendChild(pageTitle);

    // Creation du formulaire de modification de mot de passe
    const form = document.createElement('form');
    form.className = 'w-100';
    container.appendChild(form);

    // Champs du formulaire
    const fields = [
        { label: 'Ancien mot de passe', type: 'password', id: 'oldPassword', placeholder: 'Ancien mot de passe' },
        { label: 'Nouveau mot de passe', type: 'password', id: 'newPassword', placeholder: 'Nouveau mot de passe' },
        { label: 'Confirmer le nouveau mot de passe', type: 'password', id: 'confirmPassword', placeholder: 'Confirmer le nouveau mot de passe' },
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
    submitButton.textContent = 'Valider';
    form.appendChild(submitButton);

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Suppression des messages d'erreur précédents
        const errorMessages = form.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());

        // Récupération des données du formulaire
        const old_password = document.getElementById('oldPassword').value;
        const new_password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
        // Si un champ est vide
        if (!old_password || !new_password || !confirmPassword) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Tous les champs sont obligatoires';
            form.insertBefore(errorMessage, submitButton);
            return;
        }
        // Si les mots de passe ne correspondent pas
        else if (new_password !== confirmPassword) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Les mots de passe ne correspondent pas';
            form.insertBefore(errorMessage, submitButton);
            return;
        }
        // Si l'ancien mot de passe est le même que le nouveau mot de passe
        else if (new_password === old_password) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Le nouveau mot de passe doit être différent de l\'ancien';
            form.insertBefore(errorMessage, submitButton);
            return;
        }
        // Si le nouveau mot de passe a la bonne forme
        // else if (!passwordRegex.test(new_password)) {
        //     const errorMessage = document.createElement('p');
        //     errorMessage.className = 'text-danger';
        //     errorMessage.textContent = 'Le mot de passe doit contenir entre 8 et 12 caractères, au moins une lettre majuscule, une lettre minuscule et un chiffre';
        //     form.insertBefore(errorMessage, submitButton);
        //     return;
        // }

        const response = await fetch(`/api/updatePassword/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ old_password, new_password })
        });

        if (response.ok) {
            form.innerHTML = '';
            const successMessage = document.createElement('p');
            successMessage.className = 'text-success';
            successMessage.textContent = 'Mot de passe modifié avec succès';
            form.appendChild(successMessage);

            const loginButton = document.createElement('button');
            loginButton.type = 'button';
            loginButton.className = 'btn btn-primary w-100';
            loginButton.textContent = 'Retour à la page de connexion';
            loginButton.addEventListener('click', () => navigateTo('/login'));
            form.appendChild(loginButton);

        } else if (response.status === 307) {
            await fetch('/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });
            navigateTo('/login');
            return null;
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Erreur lors de la modification du mot de passe';
            form.insertBefore(errorMessage, submitButton);
        }
    });
}