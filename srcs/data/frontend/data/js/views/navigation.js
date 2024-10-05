import { navigateTo } from '../app.js';
import { getCookie } from './utils.js';

export function navigationBar(container) {
    const div = document.createElement('div');
    div.className = 'navigationBarDiv h-100 d-flex flex-column text-white';  // Utilisation des classes Bootstrap ici

    // Get user data from backend
    fetch(`/api/settings/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 307) {
            localStorage.removeItem('token');
            fetch('/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            }).then(() => navigateTo('/'));
            return null;
        } else {
            if (DEBUG) {console.error('Error:', response);}
            // throw new Error('Something went wrong');
        }
    })
    .then(data => {
        if (!data) {
            if (DEBUG) {console.error('No data received');}
            return;
        }
        const userData = {
            username: data.username,
            nickname: data.nickname,
            email: data.email,
            language: data.language,
            font_size: data.font_size,
            theme: data.dark_mode,
            avatar: data.avatar,
        };

        // Création de la barre de navigation
        const nav = document.createElement('nav');
        nav.className = 'nav d-flex flex-column justify-content-start align-items-center shadow-lg'; // Transition vers Bootstrap
        nav.style.backgroundColor = '#435574';  // Couleur personnalisée, Bootstrap ne fournit pas cette couleur directement
        div.appendChild(nav);

        const divProfile = document.createElement('div');
        divProfile.className = 'divProfile w-50 text-center';  // Bootstrap padding et text-align
        nav.appendChild(divProfile);

        const avatarItem = document.createElement('div');
        avatarItem.className = 'avatarItem rounded-circle overflow-hidden';  // Bootstrap arrondi et ombre
        divProfile.appendChild(avatarItem);

        const avatarImage = document.createElement('img');
        avatarImage.src = `data:image/png;base64, ${userData.avatar}`;
        avatarImage.className = 'avatarImage w-100 h-auto pb-2';  // Bootstrap pour la taille
        avatarImage.alt = 'Avatar';
        avatarItem.appendChild(avatarImage);

        avatarImage.addEventListener('click', () => {
            modal.style.display = 'flex';  // Affichage du modal
            setTimeout(() => {
                modal.classList.add('ModalLoginBase-show');
            }, 10);
        });

        const TitleNickname = document.createElement('h4');
        TitleNickname.className = 'TitleNickname mt-2 pb-4';  // Bootstrap pour couleur et marge
        TitleNickname.textContent = `${userData.nickname}`;
        divProfile.appendChild(TitleNickname);

        // Navigation list
        const divNav = document.createElement('div');
        divNav.className = 'divNav border-top border-2 border-bottom border-custom-color py-3 w-100';  // Utilisation de Bootstrap
        nav.appendChild(divNav);

        const NavBarList = document.createElement('ul');
        NavBarList.className = 'NavBarList list-unstyled d-flex flex-column';  // Flex column via Bootstrap
        divNav.appendChild(NavBarList);

        const PlayElem = document.createElement('li');
        PlayElem.className = 'PlayElem text-center text-primary py-2';  // Text et padding avec Bootstrap
        PlayElem.textContent = 'Play';
        NavBarList.appendChild(PlayElem);

        const ChatElem = document.createElement('li');
        ChatElem.className = 'ElemListNavBar text-center text-primary cursor py-2';  // Même traitement
        ChatElem.textContent = 'Chat';
        NavBarList.appendChild(ChatElem);

        const FriendsElem = document.createElement('li');
        FriendsElem.className = 'ElemListNavBar text-center text-primary py-2';
        FriendsElem.textContent = 'Friends';
        NavBarList.appendChild(FriendsElem);

        const LeaderboardElem = document.createElement('li');
        LeaderboardElem.className = 'ElemListNavBar text-center text-primary py-2';
        LeaderboardElem.textContent = 'Leaderboard';
        NavBarList.appendChild(LeaderboardElem);

        PlayElem.addEventListener('click', () => {
            navigateTo('/pong');
        });

        ChatElem.addEventListener('click', () => {
            navigateTo('/chat');
        });

        FriendsElem.addEventListener('click', () => {
            navigateTo('/users');
        });



        // Friends list
        const divListFriends = document.createElement('div');
        divListFriends.className = 'divListFriends d-flex justify-content-center w-100 py-3';
        divListFriends.textContent = 'Friends list';
        // TODO: Ajouter la liste des amis
        nav.appendChild(divListFriends);


        const buttonLogOut = document.createElement('button');
        buttonLogOut.className = 'buttonLogOut btn btn-danger shadow-lg mt-auto';
        buttonLogOut.textContent = 'Logout'
        nav.appendChild(buttonLogOut);

        // Événement de changement de couleur au clic
        buttonLogOut.addEventListener('mousedown', () => {
            buttonLogOut.classList.add('c82333'); // Change à une couleur plus sombre au clic
        });

        buttonLogOut.addEventListener('mouseup', () => {
            buttonLogOut.classList.remove('btn-dark'); // Reviens à la couleur initiale après le clic
        });

        buttonLogOut.addEventListener('click', () => {
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
                navigateTo('/');
            });
        });

// Modal for personal informations
        const modalInfo = document.createElement('div');
        modalInfo.className = 'modal fade modalInfo';
        modalInfo.id = 'modalInfo';
        modalInfo.setAttribute('tabindex', '-1');
        //modalInfo.style.display = 'none'; // Cachée par défaut
        modalInfo.setAttribute('aria-labelledby', 'modalInfoLabel');
        modalInfo.setAttribute('aria-hidden', 'true');
        container.appendChild(modalInfo); // Directement dans le container pour éviter les problèmes de positionnement

        const modalInfoDialog = document.createElement('div');
        modalInfoDialog.className = "modal-dialog modalInfoDialog";
        modalInfo.appendChild(modalInfoDialog);

        // Créer le contenu de la modale
        const modalInfoContent = document.createElement('div');
        modalInfoContent.className = 'modal-content modalInfoContent';
        modalInfoDialog.appendChild(modalInfoContent);

        const modalInfoHeader = document.createElement('div');
        modalInfoHeader.className = 'modal-header border-bottom border-custom-color pb-2 modalInfoHeader';
        modalInfoContent.appendChild(modalInfoHeader);

        // Titre du Modal
        const modalInfoTitle = document.createElement('h2');
        modalInfoTitle.textContent = 'Settings';
        modalInfoTitle.className = 'modal-title modalInfoTitle';
        modalInfoHeader.appendChild(modalInfoTitle);

        // Bouton pour fermer la modale
        const modalInfoCloseButton = document.createElement('span');
        modalInfoCloseButton.id = 'closeButtonInfos';
        modalInfoCloseButton.setAttribute('data-bs-dismiss', 'modal');
        modalInfoCloseButton.setAttribute('aria-label', 'Close');
        modalInfoCloseButton.textContent = '×';
        modalInfoHeader.appendChild(modalInfoCloseButton);

        modalInfoCloseButton.addEventListener('click', () => {
            modalInfo.classList.remove('modalInfo-show'); // Retirer la classe d'animation
            setTimeout(() => {
                modalInfo.style.display = 'none';
            }, 500); // Délai correspondant à la durée de l'animation CSS
        });

        const modalInfoBody = document.createElement('div');
        modalInfoBody.className = 'modal-body';
        modalInfoContent.appendChild(modalInfoBody);

        const SvgModify = document.createElement('li');
        SvgModify.className = 'SvgModify bi bi-pencil-fill d-flex justify-content-end text-center';
        SvgModify.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        SvgModify.setAttribute('width', '16');
        SvgModify.setAttribute('height', '16');
        SvgModify.setAttribute('fill', 'currentColor');
        SvgModify.setAttribute('viewBox', '0 0 16 16');
        modalInfoBody.appendChild(SvgModify);

        const ModalUsernameElem = document.createElement('div');
        ModalUsernameElem.className = 'ModalUsernameElem';
        ModalUsernameElem.textContent = `Username : ${userData.username}`;
        modalInfoBody.appendChild(ModalUsernameElem);

        const ModalNicknameElem = document.createElement('div');
        ModalNicknameElem.className = 'ModalNicknameElem';
        ModalNicknameElem.textContent = `Nickname : ${userData.nickname}`;
        modalInfoBody.appendChild(ModalNicknameElem);

        const ModalEmailElem = document.createElement('div');
        ModalEmailElem.className = 'ModalEmailElem';
        ModalEmailElem.textContent = `Email : ${userData.email}`;
        modalInfoBody.appendChild(ModalEmailElem);

        const ModalMDPElem = document.createElement('div');
        ModalMDPElem.className = 'ModalMDPElem';
        ModalMDPElem.textContent = `Password : *******`; // IMITATION
        modalInfoBody.appendChild(ModalMDPElem);

        const ModalLanguageElem = document.createElement('div');
        ModalLanguageElem.className = 'ModalLanguageElem';
        ModalLanguageElem.textContent = `Language : ${userData.language}`;
        modalInfoBody.appendChild(ModalLanguageElem);

        const ModalPoliceElem = document.createElement('div');
        ModalPoliceElem.className = 'ModalPoliceElem';
        ModalPoliceElem.textContent = `Font size : ${userData.font_size}`;
        modalInfoBody.appendChild(ModalPoliceElem);

        const ModalModeElem = document.createElement('div');
        ModalModeElem.className = 'ModalModeElem';
        ModalModeElem.textContent = `Dark Mode : ${userData.theme}`;
        modalInfoBody.appendChild(ModalModeElem);


        // SI TU CLIQUES SUR LE NICKNAME, TU AS LES INFOS
        // Ajout de l'événement pour ouvrir la modal avec animation
        document.querySelector('.TitleNickname').addEventListener('click', () => {

            // Utilisation de l'API Bootstrap pour afficher la modal
            const bootstrapModal = new bootstrap.Modal(modalInfo);


            // Positionnement de la modale à côté de la barre de navigation
            const navBar = document.querySelector('.nav'); // Sélectionner la barre de navigation
            const rect = navBar.getBoundingClientRect(); // Récupérer les dimensions et position

            modalInfo.style.position = 'absolute'; // Positionnement absolu
            modalInfo.style.top = `${rect.top}px`; // Aligner avec la barre de navigation
            modalInfo.style.left = `${rect.right + 10}px`; // La modal apparaît à droite de la barre, avec un écart de 20px

            modalInfo.style.margin = '0';  // Supprimer les marges par défaut
            modalInfo.style.transform = 'none';  // Désactiver les centrer automatiquement
            modalInfo.style.maxWidth = 'none';  // Permet à la modal de s'étendre sans limitation de largeur
            bootstrapModal.show(); // Afficher la modal
        });

//////////////////////////////////////////////////////////////////
// Modal for settings, password and accessibility
        const modalSettings = document.createElement('div');
        modalSettings.className = 'modal fade modalSettings';
        modalSettings.id = 'modalSettings';
        modalSettings.setAttribute('tabindex', '-1');
        //modalSettings.style.display = 'none'; // Cachée par défaut
        modalSettings.setAttribute('aria-labelledby', 'modalSettingsLabel');
        modalSettings.setAttribute('aria-hidden', 'true');
        container.appendChild(modalSettings); // Directement dans le container pour éviter les problèmes de positionnement

        const modalSettingsDialog = document.createElement('div');
        modalSettingsDialog.className = 'modal-dialog modalSettingsDialog';
        modalSettings.appendChild(modalSettingsDialog);

        // Créer le contenu de la modale
        const modalSettingsContent = document.createElement('div');
        modalSettingsContent.className = 'modal-content modalSettingsContent';
        modalSettingsDialog.appendChild(modalSettingsContent);

        const modalSettingsHeader = document.createElement('div');
        modalSettingsHeader.className = 'modal-header border-bottom border-custom-color pb-2 modalSettingsHeader';
        modalSettingsContent.appendChild(modalSettingsHeader);

        // Titre du Modal
        const modalSettingsTitle = document.createElement('h2');
        modalSettingsTitle.textContent = 'Modify Settings ';
        modalSettingsTitle.className = 'modal-title modalSettingsTitle';
        modalSettingsHeader.appendChild(modalSettingsTitle);

        // Bouton pour fermer la modale
        const modalSettingsCloseButton = document.createElement('span');
        modalSettingsCloseButton.id = 'closeButtonParam';
        modalSettingsCloseButton.setAttribute('data-bs-dismiss', 'modal');
        modalSettingsCloseButton.setAttribute('aria-label', 'Close');
        modalSettingsCloseButton.textContent = '×';
        modalSettingsHeader.appendChild(modalSettingsCloseButton);

        modalSettingsCloseButton.addEventListener('click', () => {
            modalSettings.classList.remove('modalSettings-show'); // Retirer la classe d'animation
            setTimeout(() => {
                modalSettings.style.display = 'none'; // Cacher la modale après l'animation
            }, 500); // Délai correspondant à la durée de l'animation CSS
        });

// SI TU CLIQUES SUR LE CRAYON, TU PEUX MODIFIER LES INFOS
        // Ajout de l'événement pour ouvrir la modal avec animation
        document.querySelector('.SvgModify').addEventListener('click', () => {

            const modalInfoElement = document.getElementById('modalInfo'); // Assure-toi que l'ID est correct
            if (modalInfoElement) {
                const bootstrapModalInfo = bootstrap.Modal.getInstance(modalInfoElement); // Récupère l'instance de la modale "modalInfo"
                if (bootstrapModalInfo) {
                    bootstrapModalInfo.hide(); // Ferme "modalInfo"
                }
            }
            // Utilisation de l'API Bootstrap pour afficher la modal
            const bootstrapModalModify = new bootstrap.Modal(modalSettings);

            // Positionnement de la modale à côté de la barre de navigation
            const navBar = document.querySelector('.nav'); // Sélectionner la barre de navigation
            const rect = navBar.getBoundingClientRect(); // Récupérer les dimensions et position

            modalSettings.style.position = 'absolute'; // Positionnement absolu
            modalSettings.style.top = `${rect.top}px`; // Aligner avec la barre de navigation
            modalSettings.style.left = `${rect.right + 10}px`; // La modal apparaît à droite de la barre, avec un écart de 20px

            modalSettings.style.margin = '0';  // Supprimer les marges par défaut
            modalSettings.style.transform = 'none';  // Désactiver les centrer automatiquement
            modalSettings.style.maxWidth = 'none';  // Permet à la modal de s'étendre sans limitation de largeur

            bootstrapModalModify.show(); // Afficher la modal
        });

        const modalSettingsBody = document.createElement('div');
        modalSettingsBody.className = 'modal-body modalSettingsBody';
        modalSettingsContent.appendChild(modalSettingsBody);

        // Formulaire de modification des paramètres {nickname, email} = settingsForm
        const settingsForm = document.createElement('form');
        settingsForm.className = 'w-100';
        modalSettingsBody.appendChild(settingsForm);

        // Creation du champ de saisie pour le nickname
        const newNicknameModify = document.createElement('input');
        newNicknameModify.type = 'text';
        newNicknameModify.id = 'nickname';
        newNicknameModify.name = 'newNicknameModify';
        newNicknameModify.className = 'form-control mb-4';
        newNicknameModify.placeholder = 'New nickname';
        settingsForm.appendChild(newNicknameModify);

        // Creation du champ de saisie pour l'email
        const newEmailModify = document.createElement('input');
        newEmailModify.type = 'email';
        newEmailModify.id = 'email';
        newEmailModify.name = 'newEmailModify';
        newEmailModify.className = 'form-control mb-4';
        newEmailModify.placeholder = 'New email';
        settingsForm.appendChild(newEmailModify);

        // Bouton de soumission
        const settingsSubmitButton = document.createElement('button');
        settingsSubmitButton.type = 'submit';
        settingsSubmitButton.className = 'btn btn-primary w-100 modalSettingsButtonsSubmit';
        settingsSubmitButton.textContent = 'Submit';
        settingsForm.appendChild(settingsSubmitButton);

        // Gestion de la soumission du formulaire
        settingsForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche la soumission par défaut du formulaire

            // Suppression des messages d'erreur ou de succès précédents
            const errorMessages = settingsForm.querySelectorAll('.text-danger');
            errorMessages.forEach(message => message.remove());
            const successMessages = settingsForm.querySelectorAll('.text-success');
            successMessages.forEach(message => message.remove());

            // Récupération des données du formulaire
            const data = new FormData(settingsForm);
            const nickname = data.get('newNicknameModify');
            const email = data.get('newEmailModify');

            try {
                // Envoi des données au serveur
                const response = await fetch('/api/updateSettings/', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({ nickname, email })
                });

                if (response.ok) {
                    // Afficher un message de succès sans remplacer tout le contenu
                    const successMessage = document.createElement('p');
                    successMessage.className = 'text-success';
                    successMessage.textContent = 'Parameters successfully modified';
                    settingsForm.appendChild(successMessage);

                    // Réinitialiser le formulaire après succès
                    settingsForm.reset();

                    // 1. Temps pour laisser le message visible
                    setTimeout(() => {
                        // 2. Fermeture de la modal avec Bootstrap
                        const modalElement = document.getElementById('modalSettings');
                        const modalInstance = bootstrap.Modal.getInstance(modalElement);
                        modalInstance.hide(); // Ferme la modal

                        // 3. Appliquer le flou
                        document.body.style.filter = 'blur(5px)'; // Applique le flou

                        // 4. Recharger la page rapidement
                        let location = window.location.href;
                        const str_split = location.split('/');
                        const length = str_split.length;
                        const locationFinal = '/' + str_split[length - 1];
                        navigateTo(locationFinal); // Recharger la page immédiatement

                        // 5. Diminuer le flou progressivement
                        let blurAmount = 4; // Montant du flou
                        const interval = setInterval(() => {
                            blurAmount -= 0.1; // Réduit progressivement le flou
                            document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`; // Assure que le flou ne soit pas négatif

                            if (blurAmount <= 0) {
                                clearInterval(interval); // Arrête l'interval si le flou est à 0
                            }
                        }, 25); // Intervalle de temps entre chaque réduction
                    }, 800); // Temps pour laisser le message visible avant la fermeture de la modal
                }
                else {
                    // Gestion des erreurs de réponse serveur
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'text-danger';
                    errorMessage.textContent = 'Error while modifying parameters';
                    settingsForm.insertBefore(errorMessage, settingsSubmitButton);

                    // Réinitialiser le formulaire après succès
                    settingsForm.reset();

                    // 1. Temps pour laisser le message visible
                    setTimeout(() => {
                        // 2. Fermeture de la modal avec Bootstrap
                        const modalElement = document.getElementById('modalSettings');
                        const modalInstance = bootstrap.Modal.getInstance(modalElement);
                        modalInstance.hide(); // Ferme la modal

                        // 3. Appliquer le flou
                        document.body.style.filter = 'blur(5px)'; // Applique le flou

                        // 4. Recharger la page rapidement
                        let location = window.location.href;
                        const str_split = location.split('/');
                        const length = str_split.length;
                        const locationFinal = '/' + str_split[length - 1];
                        navigateTo(locationFinal); // Recharger la page immédiatement

                        // 5. Diminuer le flou progressivement
                        let blurAmount = 4; // Montant du flou
                        const interval = setInterval(() => {
                            blurAmount -= 0.1; // Réduit progressivement le flou
                            document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`; // Assure que le flou ne soit pas négatif

                            if (blurAmount <= 0) {
                                clearInterval(interval); // Arrête l'interval si le flou est à 0
                            }
                        }, 25); // Intervalle de temps entre chaque réduction
                    }, 800); // Temps pour laisser le message visible avant la fermeture de la modal
                }
            } catch (error) {
                // Gestion des erreurs réseau ou autres
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Network or server error';
                settingsForm.insertBefore(errorMessage, settingsSubmitButton);

                // Réinitialiser le formulaire après succès
                settingsForm.reset();

                // 1. Temps pour laisser le message visible
                setTimeout(() => {
                    // 2. Fermeture de la modal avec Bootstrap
                    const modalElement = document.getElementById('modalSettings');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide(); // Ferme la modal

                    // 3. Appliquer le flou
                    document.body.style.filter = 'blur(5px)'; // Applique le flou

                    // 4. Recharger la page rapidement
                    let location = window.location.href;
                    const str_split = location.split('/');
                    const length = str_split.length;
                    const locationFinal = '/' + str_split[length - 1];
                    navigateTo(locationFinal); // Recharger la page immédiatement

                    // 5. Diminuer le flou progressivement
                    let blurAmount = 4; // Montant du flou
                    const interval = setInterval(() => {
                        blurAmount -= 0.1; // Réduit progressivement le flou
                        document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`; // Assure que le flou ne soit pas négatif

                        if (blurAmount <= 0) {
                            clearInterval(interval); // Arrête l'interval si le flou est à 0
                        }
                    }, 25); // Intervalle de temps entre chaque réduction
                }, 800); // Temps pour laisser le message visible
            }
        });


        // Formulaire de modification des paramètres {font_size, language, dark_mode}
        const accessibilityForm = document.createElement('form');
        accessibilityForm.className = 'w-100 mt-4 accessibilityForm';
        modalSettingsBody.appendChild(accessibilityForm);

        // Tableau des tailles de police correspondant aux valeurs du curseur
        const fontSizes = {
            1: '12px',  // Petite police
            2: '16px',  // Taille actuelle
            3: '20px'   // Grande police
        };

        const divFontSize = document.createElement('div');
        divFontSize.className = 'divFontSize';
        accessibilityForm.appendChild(divFontSize);

        // Champ de la taille de la police
        const labelFontSize = document.createElement('label');
        labelFontSize.className = 'form-label labelFontSize';
        labelFontSize.textContent = 'Font size';
        divFontSize.appendChild(labelFontSize);

        const fontSize = document.createElement('input');
        fontSize.name = 'font-size';
        fontSize.type = 'range';
        fontSize.id = 'font-size';
        fontSize.className = 'form-control-range mb-4 cursor ms-4 fontSizeCursor';
        fontSize.min = 1;
        fontSize.max = 3;
        fontSize.value = userData.font_size;
        divFontSize.appendChild(fontSize);

        // Écouteur d'événements pour le curseur
        fontSize.addEventListener('input', (event) => {
            const sizeValue = event.target.value; // Récupérer la valeur du curseur
            document.body.style.fontSize = fontSizes[sizeValue]; // Appliquer la nouvelle taille de police
        });

        // Champ de la langue
        const labelLanguage = document.createElement('label');
        labelLanguage.className = 'form-label';
        labelLanguage.textContent = 'Language';
        accessibilityForm.appendChild(labelLanguage);

        const language = document.createElement('select');
        language.name = 'language';
        language.id = 'language';
        language.className = 'form-select mb-4';
        language.value = userData.language;
        accessibilityForm.appendChild(language);

        const optionEn = document.createElement('option');
        optionEn.value = 'en';
        optionEn.textContent = 'English';
        language.appendChild(optionEn);

        const optionFr = document.createElement('option');
        optionFr.value = 'fr';
        optionFr.textContent = 'Frensh';
        language.appendChild(optionFr);

        const optionEs = document.createElement('option');
        optionEs.value = 'es';
        optionEs.textContent = 'Spanish';
        language.appendChild(optionEs);

        // Champ du mode sombre
        const labelDarkMode = document.createElement('label');
        labelDarkMode.className = 'form-label';
        labelDarkMode.textContent = 'Dark mode';
        accessibilityForm.appendChild(labelDarkMode);

        const darkMode = document.createElement('input');
        darkMode.type = 'checkbox';
        darkMode.id = 'dark-mode';
        darkMode.name = 'dark-mode';
        darkMode.className = 'form-check-input mb-4 ms-4';
        darkMode.value = userData.theme;
        accessibilityForm.appendChild(darkMode);

        // Bouton de soumission
        const accessSubmitButton = document.createElement('button');
        accessSubmitButton.type = 'submit';
        accessSubmitButton.className = 'btn btn-primary w-100 modalSettingsButtonsSubmit';
        accessSubmitButton.textContent = 'Submit';
        accessibilityForm.appendChild(accessSubmitButton);

        // Gestion de la soumission du formulaire
        accessibilityForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Suppression des messages précédents
            const errorMessages = accessibilityForm.querySelectorAll('.text-danger');
            errorMessages.forEach(message => message.remove());
            const successMessages = accessibilityForm.querySelectorAll('.text-success');
            successMessages.forEach(message => message.remove());

            // Récupération des données du formulaire
            const data = new FormData(accessibilityForm);
            const font_size = data.get('font-size');
            const language = data.get('language');
            const dark_mode = data.get('dark-mode');

            try {
                // Envoi des données au serveur
                const response = await fetch('/api/updateAccessibility/', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({ font_size, language, dark_mode })
                });

                if (response.ok) {
                    // Affichage du message de succès sans vider le formulaire
                    const successMessage = document.createElement('p');
                    successMessage.className = 'text-success';
                    successMessage.textContent = 'Parameters successfully modified';
                    accessibilityForm.appendChild(successMessage);

                    // 1. Temps pour laisser le message visible
                    setTimeout(() => {
                        // 2. Fermeture de la modal avec Bootstrap
                        const modalElement = document.getElementById('modalSettings');
                        const modalInstance = bootstrap.Modal.getInstance(modalElement);
                        modalInstance.hide(); // Ferme la modal

                        // 3. Appliquer le flou
                        document.body.style.filter = 'blur(5px)'; // Applique le flou

                        // 4. Recharger la page rapidement
                        let location = window.location.href;
                        const str_split = location.split('/');
                        const length = str_split.length;
                        const locationFinal = '/' + str_split[length - 1];
                        navigateTo(locationFinal); // Recharger la page immédiatement

                        // 5. Diminuer le flou progressivement
                        let blurAmount = 4; // Montant du flou
                        const interval = setInterval(() => {
                            blurAmount -= 0.1; // Réduit progressivement le flou
                            document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`; // Assure que le flou ne soit pas négatif

                            if (blurAmount <= 0) {
                                clearInterval(interval); // Arrête l'interval si le flou est à 0
                            }
                        }, 25); // Intervalle de temps entre chaque réduction
                    }, 800); // Temps pour laisser le message visible

                } else {
                    // Affichage du message d'erreur sans vider le formulaire
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'text-danger';
                    errorMessage.textContent = 'Error while modifying parameters';
                    accessibilityForm.insertBefore(errorMessage, accessSubmitButton);

                    // 1. Temps pour laisser le message visible
                    setTimeout(() => {
                        // 2. Fermeture de la modal avec Bootstrap
                        const modalElement = document.getElementById('modalSettings');
                        const modalInstance = bootstrap.Modal.getInstance(modalElement);
                        modalInstance.hide(); // Ferme la modal

                        // 3. Appliquer le flou
                        document.body.style.filter = 'blur(5px)'; // Applique le flou

                        // 4. Recharger la page rapidement
                        let location = window.location.href;
                        const str_split = location.split('/');
                        const length = str_split.length;
                        const locationFinal = '/' + str_split[length - 1];
                        navigateTo(locationFinal); // Recharger la page immédiatement

                        // 5. Diminuer le flou progressivement
                        let blurAmount = 4; // Montant du flou
                        const interval = setInterval(() => {
                            blurAmount -= 0.1; // Réduit progressivement le flou
                            document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`; // Assure que le flou ne soit pas négatif

                            if (blurAmount <= 0) {
                                clearInterval(interval); // Arrête l'interval si le flou est à 0
                            }
                        }, 25); // Intervalle de temps entre chaque réduction
                    }, 800); // Temps pour laisser le message visible
                }
            } catch (error) {
                // Gestion des erreurs réseau ou autres
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Network or server error';
                accessibilityForm.insertBefore(errorMessage, accessSubmitButton);

                // 1. Temps pour laisser le message visible
                setTimeout(() => {
                    // 2. Fermeture de la modal avec Bootstrap
                    const modalElement = document.getElementById('modalSettings');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide(); // Ferme la modal

                    // 3. Appliquer le flou
                    document.body.style.filter = 'blur(5px)'; // Applique le flou

                    // 4. Recharger la page rapidement
                    let location = window.location.href;
                    const str_split = location.split('/');
                    const length = str_split.length;
                    const locationFinal = '/' + str_split[length - 1];
                    navigateTo(locationFinal); // Recharger la page immédiatement

                    // 5. Diminuer le flou progressivement
                    let blurAmount = 4; // Montant du flou
                    const interval = setInterval(() => {
                        blurAmount -= 0.1; // Réduit progressivement le flou
                        document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`; // Assure que le flou ne soit pas négatif

                        if (blurAmount <= 0) {
                            clearInterval(interval); // Arrête l'interval si le flou est à 0
                        }
                    }, 25); // Intervalle de temps entre chaque réduction
                }, 800); // Temps pour laisser le message visible
            }
        });
    });
    return div;
}
