import { navigateTo } from './utils.js';
import { getCookie } from './utils.js';

export function passwordView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Titre de la page
    const pageTitle = document.createElement('h2');
    pageTitle.className = 'text-center mb-4';
    pageTitle.textContent = 'Modification de Mot de Passe';
    container.appendChild(pageTitle);

    // Formulaire de modification de mot de passe
    const form = document.createElement('form');
    form.className = 'w-100';
    container.appendChild(form);

    // Champ de l'ancien mot de passe
    const oldPassword = document.createElement('input');
    oldPassword.type = 'password';
    oldPassword.name = 'oldPassword';
    oldPassword.className = 'form-control mb-4';
    oldPassword.placeholder = 'Ancien mot de passe';
    form.appendChild(oldPassword);

    // Champ du nouveau mot de passe
    const newPassword = document.createElement('input');
    newPassword.type = 'password';
    newPassword.name = 'newPassword';
    newPassword.className = 'form-control mb-4';
    newPassword.placeholder = 'Nouveau mot de passe';
    form.appendChild(newPassword);

    // Champ de confirmation du nouveau mot de passe
    const confirmPassword = document.createElement('input');
    confirmPassword.type = 'password';
    confirmPassword.name = 'confirmPassword';
    confirmPassword.className = 'form-control mb-4';
    confirmPassword.placeholder = 'Confirmer le nouveau mot de passe';
    form.appendChild(confirmPassword);

    // Bouton de validation
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
        const data = new FormData(form);
        const old_password = data.get('oldPassword');
        const new_password = data.get('newPassword');
        const confirmPassword = data.get('confirmPassword');

        // Si un champ est vide
        if (!old_password || !new_password || !confirmPassword) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Tous les champs sont obligatoires';
            form.insertBefore(errorMessage, submitButton);
            return;
        }
        // Si les mots de passe ne correspondent pas
        if (new_password !== confirmPassword) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Les mots de passe ne correspondent pas';
            form.insertBefore(errorMessage, submitButton);
            return;
        }
        // Si l'ancien mot de passe est le même que le nouveau mot de passe
        if (new_password === old_password) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Le nouveau mot de passe doit être différent de l\'ancien';
            form.insertBefore(errorMessage, submitButton);
            return;
        }
        // Si le nouveau mot de passe a la bonne forme
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
        if (!passwordRegex.test(new_password)) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Le mot de passe doit contenir entre 8 et 12 caractères, au moins une lettre majuscule, une lettre minuscule et un chiffre';
            form.insertBefore(errorMessage, submitButton);
            return;
        }

        // Verifier si l'utilisateur est connecté
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const user = localStorage.getItem('username');
        if (isLoggedIn) {
            const response = await fetch(`/api/updatePassword/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
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

            } else {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Erreur lors de la modification du mot de passe';
                form.insertBefore(errorMessage, submitButton);
            }
        } else {
            alert('Vous devez être connecté pour modifier votre mot de passe');
        }
    });
}