import { getCookie } from './utils.js';
import { navigateTo } from './utils.js';

export function settingsView(container) {
    // Clear previous content
    container.innerHTML = '';
 
    // Titre de la page
    const pageTitle = document.createElement('h2');
    pageTitle.className = 'text-center mb-4';
    pageTitle.textContent = 'Paramètres';
    container.appendChild(pageTitle);
  
    const token = localStorage.getItem('token');
    // Recuperer les infos de l'utilisateur dans le backend
    // fetch(`/api/settings/`, {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //         'X-CSRFToken': getCookie('csrftoken'),
    //     },
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     const userData = {
    //         nickname: data.nickname,
    //         email: data.email,
    //         language: data.language,
    //         accessibility: data.accessibility,
    //         theme: data.dark_mode,
    //         avatar: data.avatar,
    //     };

    fetch(`/api/settings/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
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
            }
            else {
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
        // Affichage des informations personnelles
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
        avatarItem.textContent = 'Avatar';
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

        // Sections de paramètres
        const sections = [
        {
          title: 'Modification des informations personnelles',
        // Possibilité de modifier les informations personnelles
          fields: [
            { label: 'Nickname - Affiché durant les tournois', type: 'text', id: 'nickname', placeholder: 'Entrez votre nickname' },
            { label: 'Adresse email', type: 'email', id: 'email', placeholder: 'Entrez votre email' },
            { label: 'Avatar', type: 'file', id: 'avatar', placeholder: 'Choisissez un avatar' },
          ]
        },
        // {
        //   title: 'Modification du mot de passe',
        //   fields: [
        //     { label: 'Mot de passe actuel', type: 'password', id: 'current-password', placeholder: 'Entrez votre mot de passe actuel' },
        //     { label: 'Nouveau mot de passe', type: 'password', id: 'new-password', placeholder: 'Entrez un nouveau mot de passe' },
        //     { label: 'Confirmer le nouveau mot de passe', type: 'password', id: 'confirm-new-password', placeholder: 'Confirmez le nouveau mot de passe' },
        //   ]
        // },
        {
          title: 'Modification des préférences',
          fields: [
            { label: 'Langue', type: 'select', id: 'langue', options: ['Français', 'Anglais', 'Espagnol'] },
            { label: 'Taille de la police', type: 'range', id: 'font-size', placeholder: 'Entrez la taille de la police' },
            { label: 'Thème', type: 'select', id: 'theme', options: ['Clair', 'Sombre'] },
            { label: 'Contraste', type: 'select', id: 'contrast', options: ['Normal', 'Faible', 'Elevé'] },
          ]
        }];

        sections.forEach(section => {
            // Création de la carte pour chaque section
            const sectionCard = document.createElement('div');
            sectionCard.className = 'card mb-4';

            // Création de l'en-tête de la carte
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'card-header';
            sectionHeader.textContent = section.title;

            // Création du corps de la carte
            const sectionBody = document.createElement('div');
            sectionBody.className = 'card-body';

            // Création du formulaire pour chaque section
            const form = document.createElement('form');

            // Ajout des champs dans le formulaire
            section.fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'mb-3';

            // Création de l'étiquette pour chaque champ
            const label = document.createElement('label');
            label.className = 'form-label';
            label.htmlFor = field.id;
            label.textContent = field.label;

            // Création de l'élément d'entrée pour chaque champ
            let input;
            if (field.type === 'select') {
                // Select input type
                input = document.createElement('select');
                input.className = 'form-select';
                input.id = field.id;
                field.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.toLowerCase();
                optionElement.textContent = option;
                input.appendChild(optionElement);
                });
            } else if (field.type === 'checkbox') {
                // Checkbox input type
                input = document.createElement('input');
                input.type = 'checkbox';
                input.className = 'form-check-input';
                input.id = field.id;

                const checkboxLabel = document.createElement('label');
                checkboxLabel.className = 'form-check-label';
                checkboxLabel.htmlFor = field.id;
                checkboxLabel.textContent = field.label;

                formGroup.appendChild(input);
                formGroup.appendChild(checkboxLabel);
                form.appendChild(formGroup);
                return; // Skip the usual input append
            } else {
                // Default input type is text
                input = document.createElement('input');
                input.type = field.type;
                input.className = 'form-control';
                input.id = field.id;
                input.placeholder = field.placeholder;
            }

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            form.appendChild(formGroup);
            });

            // Bouton de soumission pour chaque section
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.className = 'btn btn-primary w-100';
            submitButton.textContent = 'Enregistrer les modifications';
            form.appendChild(submitButton);

            // Envoi des données du formulaire
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });
                console.log(data);
                fetch(`/api/updateSettings/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify(data),
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                });
            });

            sectionBody.appendChild(form);

            // Ajout du corps et de l'en-tête à la carte
            sectionCard.appendChild(sectionHeader);
            sectionCard.appendChild(sectionBody);
            container.appendChild(sectionCard);
            document.body.appendChild(container);
        });

            // Create and append logout button
            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Logout';
            logoutButton.className = 'btn btn-danger';
            logoutButton.addEventListener('click', (event) => {
            localStorage.removeItem('username');
            event.preventDefault();
            navigateTo('/login'); // Redirect to login page

            // Fetch to disconnect
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
            });
        });
        container.appendChild(logoutButton);
    });
}