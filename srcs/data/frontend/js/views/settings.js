import { navigateTo } from './utils.js';
import { getCookie } from './utils.js';

export function settingsView(container) {
    // Suppression du contenu précédent
    container.innerHTML = '';

    // Titre de la page
    const pageTitle = document.createElement('h2');
    pageTitle.className = 'text-center mb-4';
    pageTitle.textContent = 'Paramètres';
    container.appendChild(pageTitle);

    // Recuperer les infos de l'utilisateur dans le backend
    fetch(`/api/settings/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    //If the status response is 200, we get the data else throw an error or redirect to login if status is 307 without passing in the data block
    .then(response => {
        if (response.status === 200) {
            return response.json();
        }
        else if (response.status === 307) {
            //Call the logout function
            localStorage.removeItem('token');
            fetch('/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            }).then(r => r.json())
            navigateTo('/login');
            return null;
        } else {
            throw new Error('Something went wrong');
        }
    })
    .then(data => {
        if (!data) {
            return;
        }
        const userData = {
            nickname: data.nickname,
            email: data.email,
            language: data.language,
            accessibility: data.accessibility,
            theme: data.dark_mode,
            avatar: data.avatar,
        };

// *************** Affichage des informations personnelles ***************
        const personalInfo = document.createElement('div');
        personalInfo.className = 'card mb-4';
        const personalInfoHeader = document.createElement('div');
        personalInfoHeader.className = 'card-header';
        personalInfoHeader.textContent = 'Informations personnelles';
        const personalInfoBody = document.createElement('div');
        personalInfoBody.className = 'card-body';
        const personalInfoList = document.createElement('ul');
        personalInfoList.className = 'list-group list-group-flush';
        const nicknameItem = document.createElement('li');
        nicknameItem.className = 'list-group-item';
        nicknameItem.textContent = `Nickname: ${userData.nickname}`;
        const emailItem = document.createElement('li');
        emailItem.className = 'list-group-item';
        emailItem.textContent = `Email: ${userData.email}`;
        const avatarItem = document.createElement('li');
        avatarItem.className = 'list-group-item';
        avatarItem.textContent = 'Avatar: ';
        const avatarImage = document.createElement('img');
        avatarImage.src = `data:image/png;base64, ${userData.avatar}`;
        avatarImage.className = 'img-fluid rounded-circle';
        avatarItem.appendChild(avatarImage);
        personalInfoList.appendChild(nicknameItem);
        personalInfoList.appendChild(emailItem);
        personalInfoList.appendChild(avatarItem);
        personalInfoBody.appendChild(personalInfoList);
        personalInfo.appendChild(personalInfoHeader);
        personalInfo.appendChild(personalInfoBody);
        container.appendChild(personalInfo);
// *************** Fin d'affichage des informations personnelles ***************

// *************** Modification des paramètres ***************
    // Div pour les paramètres
    const settingsDiv = document.createElement('div');
    settingsDiv.className = 'card mb-4';

    const settingsHeader = document.createElement('div');
    settingsHeader.className = 'card-header';
    settingsHeader.textContent = 'Modifier les paramètres';

    const settingsBody = document.createElement('div');
    settingsBody.className = 'card-body';

    // Formulaire de modification des paramètres
    const form = document.createElement('form');
    form.className = 'w-100';
  
    // Creation du label pour le nickname
    const label = document.createElement('label');
    label.className = 'form-label';
    label.htmlFor = 'nickname';
    label.textContent = 'Nickname';

    // Creation du champ de saisie pour le nickname
    const newNickname = document.createElement('input');
    newNickname.type = 'text';
    newNickname.id = 'nickname';
    newNickname.name = 'newNickname';
    newNickname.className = 'form-control mb-4';
    newNickname.placeholder = 'Entrez votre nickname';

    // Creation du label pour l'email
    const label2 = document.createElement('label');
    label2.className = 'form-label';
    label2.htmlFor = 'email';
    label2.textContent = 'Email';

    // Creation du champ de saisie pour l'email
    const newEmail = document.createElement('input');
    newEmail.type = 'email';
    newEmail.id = 'email';
    newEmail.name = 'newEmail';
    newEmail.className = 'form-control mb-4';
    newEmail.placeholder = 'Entrez votre email';

////////////////////////////////////////////////////////
    // // Creation du champ de saisie pour l'avatar
    // const newAvatar = document.createElement('input');
    // newAvatar.type = 'file';
    // newAvatar.id = 'avatar';
    // newAvatar.name = 'newAvatar';
    // newAvatar.className = 'form-control mb-4';
////////////////////////////////////////////////////////

    // Bouton de soumission
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary w-100';
    submitButton.textContent = 'Enregistrer les modifications';

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire

        // Suppression des messages d'erreur précédents
        const errorMessages = form.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());

        // Récupération des données du formulaire
        const data = new FormData(form);
        const nickname = data.get('newNickname');
        const email = data.get('newEmail');
        // const new_avatar = data.get('avatar');

        // Envoi des données au serveur
        const response = await fetch('/api/updateSettings/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ nickname, email, /*new_avatar*/ })
            // body: data,
        });
        if (response.ok) {
            form.innerHTML = '';
            const successMessage = document.createElement('p');
            successMessage.className = 'text-success';
            successMessage.textContent = 'Paramètres modifiés avec succès';
            form.appendChild(successMessage);
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Erreur lors de la modification des paramètres';
            form.insertBefore(errorMessage, submitButton);
        }
    })

    // Ajout des éléments au DOM
    settingsDiv.appendChild(settingsHeader);
    settingsDiv.appendChild(settingsBody);
    settingsBody.appendChild(form);
    form.appendChild(label);
    form.appendChild(newNickname);
    form.appendChild(label2);
    form.appendChild(newEmail);
    // form.appendChild(newAvatar);
    form.appendChild(submitButton);
    container.appendChild(settingsDiv);
// *************** Fin de modification des paramètres ***************

// *************** Modification de l'avatar ***************
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'card mb-4';

    const avatarHeader = document.createElement('div');
    avatarHeader.className = 'card-header';
    avatarHeader.textContent = 'Modifier l\'avatar';

    const avatarBody = document.createElement('div');
    avatarBody.className = 'card-body';

    // Formulaire de modification de l'avatar
    const avatarForm = document.createElement('form');
    avatarForm.className = 'w-100';

    // Creation du champ de saisie pour l'avatar
    const newAvatar = document.createElement('input');
    newAvatar.type = 'file';
    newAvatar.id = 'avatar';
    newAvatar.name = 'newAvatar';
    newAvatar.className = 'form-control mb-4';

    // Bouton de soumission
    const avatarSubmitButton = document.createElement('button');
    avatarSubmitButton.type = 'submit';
    avatarSubmitButton.className = 'btn btn-primary w-100';
    avatarSubmitButton.textContent = 'Enregistrer l\'avatar';

    // Gestion de la soumission du formulaire
    avatarForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire

        // Suppression des messages d'erreur précédents
        const errorMessages = avatarForm.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());

        // Récupération des données du formulaire
        const data = new FormData(avatarForm);
        const avatar = data.get('newAvatar');
        console.log(avatar);
        if (!avatar.size || avatar.name === '') {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Veuillez choisir un fichier';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
            return;
        }
        if (avatar.size > 1000000) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Fichier trop volumineux (max 1 Mo)';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
        }
        // Envoi des données au serveur
        const response = await fetch('/api/updateAvatar/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: avatar,
        });
        if (response.ok) {
            avatarForm.innerHTML = '';
            const successMessage = document.createElement('p');
            successMessage.className = 'text-success';
            successMessage.textContent = 'Avatar modifié avec succès';
            avatarForm.appendChild(successMessage);
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Erreur lors de la modification de l\'avatar';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
        }
    })


    // Ajout des éléments au DOM
    avatarDiv.appendChild(avatarHeader);
    avatarDiv.appendChild(avatarBody);
    avatarBody.appendChild(avatarForm);
    avatarForm.appendChild(newAvatar);
    avatarForm.appendChild(avatarSubmitButton);
    container.appendChild(avatarDiv);
// *************** Fin de modification de l'avatar ***************

// *************** Modification de l'accessibilite ***************
    const accessibilityDiv = document.createElement('div');
    accessibilityDiv.className = 'card mb-4';

    const accessibilityHeader = document.createElement('div');
    accessibilityHeader.className = 'card-header';
    accessibilityHeader.textContent = 'Accessibilité';

    const accessibilityBody = document.createElement('div');
    accessibilityBody.className = 'card-body';

    // Formulaire de modification de l'accessibilité
    const AccessibilityForm = document.createElement('form');
    AccessibilityForm.className = 'w-100';

    // Champ de la taille de la police
    const labelFontSize = document.createElement('label');
    labelFontSize.className = 'form-label';
    labelFontSize.htmlFor = 'font-size';
    labelFontSize.textContent = 'Taille de la police';

    const fontSize = document.createElement('input');
    fontSize.type = 'range';
    fontSize.id = 'font-size';
    fontSize.name = 'font-size';
    fontSize.className = 'form-control-range mb-4';
    fontSize.min = 1;
    fontSize.max = 3;
    fontSize.value = 1;

    const exampleElement = document.createElement('p');
    exampleElement.id = 'example-font-size';
    exampleElement.textContent = 'Aa';
    exampleElement.style.fontSize = '1rem'; // Default value, to be changed by the user's choice later
    fontSize.addEventListener('input', () => {
        exampleElement.style.fontSize = `${fontSize.value}rem`;
    });

    // Champ de la langue
    const labelLanguage = document.createElement('label');
    labelLanguage.className = 'form-label';
    labelLanguage.htmlFor = 'language';
    labelLanguage.textContent = 'Langue';

    const language = document.createElement('select');
    language.name = 'language';
    language.id = 'language';
    language.className = 'form-select';

    const option1 = document.createElement('option');
    option1.value = 'fr';
    option1.textContent = 'Français';
    language.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = 'en';
    option2.textContent = 'English';
    language.appendChild(option2);

    const option3 = document.createElement('option');
    option3.value = 'sp';
    option3.textContent = 'Spanish';
    language.appendChild(option3);

    // Champ du mode sombre
    const labelDarkMode = document.createElement('label');
    labelDarkMode.className = 'form-label';
    labelDarkMode.htmlFor = 'dark-mode';
    labelDarkMode.textContent = 'Mode sombre';

    const darkMode = document.createElement('input');
    darkMode.type = 'checkbox';
    darkMode.id = 'dark-mode';
    darkMode.name = 'dark-mode';
    darkMode.className = 'form-check-input mb-4';

    // Bouton de validation
    const accessSubmitButton = document.createElement('button');
    accessSubmitButton.type = 'submit';
    accessSubmitButton.className = 'btn btn-primary w-100';
    accessSubmitButton.textContent = 'Enregistrer les modifications';

    // Gestion de la soumission du formulaire
    AccessibilityForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Suppression des messages d'erreur précédents
        const errorMessages = AccessibilityForm.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());

        // Récupération des données du formulaire
        const data = new FormData(AccessibilityForm);
        const font_size = data.get('font-size');
        const language = data.get('language');
        const dark_mode = data.get('dark-mode');

        // Envoi des données au serveur
        const response = await fetch('/api/updateAccessibility/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ font_size, language, dark_mode })
        })
        .catch((error) => {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Erreur lors de la modification des paramètres';
            AccessibilityForm.insertBefore(errorMessage, accessSubmitButton);
            console.error('Error:', error);
        });

        if (response.ok) {
            AccessibilityForm.innerHTML = '';
            const successMessage = document.createElement('p');
            successMessage.className = 'text-success';
            successMessage.textContent = 'Paramètres modifiés avec succès';
            AccessibilityForm.appendChild(successMessage);
        } 
    })

    // Ajout des éléments au DOM
    accessibilityDiv.appendChild(accessibilityHeader);
    accessibilityDiv.appendChild(accessibilityBody);
    accessibilityBody.appendChild(AccessibilityForm);
    AccessibilityForm.appendChild(labelFontSize);
    AccessibilityForm.appendChild(fontSize);
    AccessibilityForm.appendChild(exampleElement);
    AccessibilityForm.appendChild(labelLanguage);
    AccessibilityForm.appendChild(language);
    AccessibilityForm.appendChild(labelDarkMode);
    AccessibilityForm.appendChild(darkMode);
    AccessibilityForm.appendChild(accessSubmitButton);
    container.appendChild(accessibilityDiv);
// *************** Fin de modification de l'accessibilité ***************


// *************** Modification du mot de passe ***************
    const passwordDiv = document.createElement('div');
    passwordDiv.className = 'card mb-4';


    const passwordBody = document.createElement('div');
    passwordBody.className = 'card-body';

    // Bouton de redirection vers la page de modification du mot de passe
    const passwordButton = document.createElement('button');
    passwordButton.className = 'btn btn-light w-100';
    passwordButton.innerHTML = '<a href="#" id=passwordLink>Modifier le mot de passe</a>';  // Attention a la couleur du lien, a changer

    // Ajouter un gestionnaire d'événements au lien
    passwordButton.querySelector('#passwordLink').addEventListener('click', function(event) {
        event.preventDefault();
        navigateTo('/password');
    });

    passwordDiv.appendChild(passwordBody);
    passwordBody.appendChild(passwordButton);
    container.appendChild(passwordDiv);
// *************** Fin de modification du mot de passe ***************


// *************** Deconnexion ***************
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.className = 'btn btn-danger';
    logoutButton.addEventListener('click', (event) => {
        
        fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => response.json())
        .then(data => {
            localStorage.removeItem('token');
            console.log(data);

            event.preventDefault();
            navigateTo('/login');
        });
    });
    container.appendChild(logoutButton);
// *************** Fin de deconnexion ***************
    });
}
