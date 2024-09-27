import { getCookie } from '../utils.js';
import { DEBUG, navigateTo } from '../../app.js';

export function settingsView(container) {
    container.innerHTML = '';

    // Récupérer les infos de l'utilisateur depuis le backend
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
            }).then(() => navigateTo('/login'));
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

        // Créer la structure de profil avec Bootstrap
        const ProfileBase = document.createElement('div');
        ProfileBase.className = 'ProfileBase w-100 h-100 d-flex flex-column';  // Utilisation des classes Bootstrap ici
        container.appendChild(ProfileBase);

        const nav = document.createElement('nav');
        nav.className = 'nav d-flex flex-column justify-content-start align-items-center shadow-lg'; // Transition vers Bootstrap
        nav.style.backgroundColor = '#435574';  // Couleur personnalisée, Bootstrap ne fournit pas cette couleur directement
        ProfileBase.appendChild(nav);

        const divProfil = document.createElement('div');
        divProfil.className = 'divProfil w-50 text-center';  // Bootstrap padding et text-align
        nav.appendChild(divProfil);

        const avatarItem = document.createElement('div');
        avatarItem.className = 'avatarItem rounded-circle overflow-hidden shadow-sm';  // Bootstrap arrondi et ombre
        divProfil.appendChild(avatarItem);

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
        divProfil.appendChild(TitleNickname);

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
        ChatElem.className = 'ElemListNavBar text-center text-primary py-2';  // Même traitement
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

        // Liste des amis
        const divListFriends = document.createElement('div');
        divListFriends.className = 'divListFriends d-flex justify-content-center w-100 py-3';
        divListFriends.textContent = 'Friends list';
        nav.appendChild(divListFriends);

        // Bouton de déconnexion
        // const divLogout = document.createElement('div');
        // divLogout.className = 'divLogout position-absolute bottom-0 w-100 d-flex justify-content-center p-3';
        // nav.appendChild(divLogout);

        const buttonLogOut = document.createElement('button');
        buttonLogOut.className = 'buttonLogOut btn btn-danger shadow-lg mt-auto';
        buttonLogOut.textContent = 'Logout'
        nav.appendChild(buttonLogOut);

        // const svgLogOut = document.createElement('svg');
        // svgLogOut.className = 'svgLogOut bi bi-box-arrow-right d-flex justify-content-center text-center';
        // svgLogOut.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        // svgLogOut.setAttribute('width', '16');
        // svgLogOut.setAttribute('height', '16');
        // svgLogOut.setAttribute('fill', 'currentColor');
        // svgLogOut.setAttribute('viewBox', '0 0 16 16');
        // buttonLogOut.appendChild(svgLogOut);

        // Événement de changement de couleur au clic
        buttonLogOut.addEventListener('mousedown', () => {
            buttonLogOut.classList.add('c82333'); // Change à une couleur plus sombre au clic
        });

        buttonLogOut.addEventListener('mouseup', () => {
            buttonLogOut.classList.remove('btn-dark'); // Reviens à la couleur initiale après le clic
        });

        ///////////////////
        // Modal-Param
        const modalParam = document.createElement('div');
        modalParam.className = 'modal fade';
        modalParam.setAttribute('tabindex', '-1');
        // modalParam.id = 'modalParam';
        //modalParam.style.display = 'none'; // Cachée par défaut
        modalParam.setAttribute('aria-labelledby', 'modalParamLabel');
        modalParam.setAttribute('aria-hidden', 'true');
        container.appendChild(modalParam);

        const modalParamDialog = document.createElement('div');
        modalParamDialog.classList.add('modal-dialog');
        modalParam.appendChild(modalParamDialog);

        // Créer le contenu de la modale
        const modalParamContent = document.createElement('div');
        modalParamContent.className = 'modal-content';
        // modalParamContent.id = 'modalParamContent';
        modalParamDialog.appendChild(modalParamContent);

        const modalParamHeader = document.createElement('div');
        modalParamHeader.className = 'modal-header border-bottom border-custom-color pb-2';
        // modalParamHeader.id = 'modalParamHeader';
        modalParamContent.appendChild(modalParamHeader);

        // Titre du Modal
        const modalParamTitle = document.createElement('h2');
        modalParamTitle.textContent = 'Settings';
        modalParamTitle.className = 'modal-title';
        // modalParamTitle.id = 'modalParamTitle';/////
        modalParamHeader.appendChild(modalParamTitle);

        // Bouton pour fermer la modale
        const closeButtonParam = document.createElement('span');
        // closeButtonParam.className = 'btn-close';
        closeButtonParam.id = 'close-button-Param';
        closeButtonParam.setAttribute('data-bs-dismiss', 'modal');
        closeButtonParam.setAttribute('aria-label', 'Close');
        closeButtonParam.textContent = '×'; // Symbole de fermeture
        modalParamHeader.appendChild(closeButtonParam);


        // Ajout de l'événement pour ouvrir la modal avec animation
        document.querySelector('.TitleNickname').addEventListener('click', () => {
            // Utilisation de l'API Bootstrap pour afficher la modal
            const bootstrapModal = new bootstrap.Modal(modalParam);

            // Positionnement de la modale à côté de la barre de navigation
            const navBar = document.querySelector('.nav'); // Sélectionner la barre de navigation
            const rect = navBar.getBoundingClientRect(); // Récupérer les dimensions et position

            modalParam.style.position = 'absolute'; // Positionnement absolu
            modalParam.style.top = `${rect.top}px`; // Aligner avec la barre de navigation
            modalParam.style.left = `${rect.right + 10}px`; // La modal apparaît à droite de la barre, avec un écart de 20px

            modalParam.style.margin = '0';  // Supprimer les marges par défaut
            modalParam.style.transform = 'none';  // Désactiver les centrer automatiquement
            modalParam.style.maxWidth = 'none';  // Permet à la modal de s'étendre sans limitation de largeur
            bootstrapModal.show(); // Afficher la modal
        });

        // TitleNickname.addEventListener('click', () => {
        //     modalParam.style.display = 'flex'; // Changer l'affichage à flex pour centrer
        //     setTimeout(() => {
        //         modalParam.classList.add('modalParam-show'); // Ajouter la classe d'animation
        //     }, 10); // Petit délai pour activer la transition après l'affichage
        // });

        // Événement pour fermer la modale PARAM avec animation
        closeButtonParam.addEventListener('click', () => {
            modalParam.classList.remove('modalParam-show'); // Retirer la classe d'animation
            setTimeout(() => {
                modalParam.style.display = 'none'; // Cacher la modale après l'animation
            }, 500); // Délai correspondant à la durée de l'animation CSS
        });

        const ModalParamBody = document.createElement('div');
        ModalParamBody.className = 'modal-body';
        // ModalParamBody.id = 'ModalParamBody';
        modalParamContent.appendChild(ModalParamBody);

        const SvgModify = document.createElement('li');
        SvgModify.className = 'SvgModify bi bi-pencil-fill d-flex justify-content-end text-center';
        SvgModify.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        SvgModify.setAttribute('width', '16');
        SvgModify.setAttribute('height', '16');
        SvgModify.setAttribute('fill', 'currentColor');
        SvgModify.setAttribute('viewBox', '0 0 16 16');
        ModalParamBody.appendChild(SvgModify);

        const ModalUsernameElem = document.createElement('div');
        ModalUsernameElem.className = 'ModalUsernameElem';
        ModalUsernameElem.textContent = `Username : ${userData.username}`;
        ModalParamBody.appendChild(ModalUsernameElem);

        const ModalNicknameElem = document.createElement('div');
        ModalNicknameElem.className = 'ModalNicknameElem';
        ModalNicknameElem.textContent = `Nickname : ${userData.nickname}`;
        ModalParamBody.appendChild(ModalNicknameElem);

        const ModalEmailElem = document.createElement('div');
        ModalEmailElem.className = 'ModalEmailElem';
        ModalEmailElem.textContent = `Email : ${userData.email}`;
        ModalParamBody.appendChild(ModalEmailElem);

        const ModalMDPElem = document.createElement('div');
        ModalMDPElem.className = 'ModalMDPElem';
        ModalMDPElem.textContent = `Password : **********`; // IMITATION
        ModalParamBody.appendChild(ModalMDPElem);

        const ModalLanguageElem = document.createElement('div');
        ModalLanguageElem.className = 'ModalLanguageElem';
        ModalLanguageElem.textContent = `Language : ${userData.language}`;
        ModalParamBody.appendChild(ModalLanguageElem);

        const ModalPoliceElem = document.createElement('div');
        ModalPoliceElem.className = 'ModalPoliceElem';
        ModalPoliceElem.textContent = `Font size : ${userData.font_size}`;
        ModalParamBody.appendChild(ModalPoliceElem);

        const ModalModeElem = document.createElement('div');
        ModalModeElem.className = 'ModalModeElem';
        ModalModeElem.textContent = `Dark Mode : ${userData.theme}`;
        ModalParamBody.appendChild(ModalModeElem);
        /////////////////////////////////////////////////



        //MODAL PARAMCHANGE
        const modalParamModify = document.createElement('div');
        modalParamModify.className = 'modal fade';
        modalParamModify.setAttribute('tabindex', '-1');
        // modalParamModify.id = 'modalParam';
        //modalParamModify.style.display = 'none'; // Cachée par défaut
        modalParamModify.setAttribute('aria-labelledby', 'modalParamLabel');
        modalParamModify.setAttribute('aria-hidden', 'true');
        container.appendChild(modalParamModify);

        const modalParamModifyDialog = document.createElement('div');
        modalParamModifyDialog.classList.add('modal-dialog');
        modalParamModify.appendChild(modalParamModifyDialog);

        // Créer le contenu de la modale
        const modalParamModifyContent = document.createElement('div');
        modalParamModifyContent.className = 'modal-content';
        // modalParamModifyContent.id = 'modalParamContent';
        modalParamModifyDialog.appendChild(modalParamModifyContent);

        const modalParamModifyHeader = document.createElement('div');
        modalParamModifyHeader.className = 'modal-header border-bottom border-custom-color pb-2';
        // modalParamModifyHeader.id = 'modalParamModifyHeader';
        modalParamModifyContent.appendChild(modalParamModifyHeader);

        // Titre du Modal
        const modalParamModifyTitle = document.createElement('h2');
        modalParamModifyTitle.textContent = 'Modify Settings';
        modalParamModifyTitle.className = 'modal-title';
        // modalParamModifyTitle.id = 'modalParamModifyTitle';/////
        modalParamModifyHeader.appendChild(modalParamModifyTitle);

        // Bouton pour fermer la modale
        const closeButtonModify = document.createElement('span');
        // closeButtonModify.className = 'btn-close';
        closeButtonModify.id = 'close-button-Modify';
        closeButtonModify.setAttribute('data-bs-dismiss', 'modal');
        closeButtonModify.setAttribute('aria-label', 'Close');
        closeButtonModify.textContent = '×'; // Symbole de fermeture
        modalParamModifyHeader.appendChild(closeButtonModify);


        // Ajout de l'événement pour ouvrir la modal avec animation
        document.querySelector('.SvgModify').addEventListener('click', () => {
            // Utilisation de l'API Bootstrap pour afficher la modal
            const bootstrapModalModify = new bootstrap.Modal(modalParamModify);

            // Positionnement de la modale à côté de la barre de navigation
            const navBar = document.querySelector('.nav'); // Sélectionner la barre de navigation
            const rect = navBar.getBoundingClientRect(); // Récupérer les dimensions et position

            modalParamModify.style.position = 'absolute'; // Positionnement absolu
            modalParamModify.style.top = `${rect.top}px`; // Aligner avec la barre de navigation
            modalParamModify.style.left = `${rect.right + 10}px`; // La modal apparaît à droite de la barre, avec un écart de 20px

            modalParamModify.style.margin = '0';  // Supprimer les marges par défaut
            modalParamModify.style.transform = 'none';  // Désactiver les centrer automatiquement
            modalParamModify.style.maxWidth = 'none';  // Permet à la modal de s'étendre sans limitation de largeur
            bootstrapModalModify.show(); // Afficher la modal
        });

        // TitleNickname.addEventListener('click', () => {
        //     modalParam.style.display = 'flex'; // Changer l'affichage à flex pour centrer
        //     setTimeout(() => {
        //         modalParam.classList.add('modalParam-show'); // Ajouter la classe d'animation
        //     }, 10); // Petit délai pour activer la transition après l'affichage
        // });

        // Événement pour fermer la modale PARAM avec animation
        closeButtonModify.addEventListener('click', () => {
            modalParamModify.classList.remove(' modalParamModify-show'); // Retirer la classe d'animation
            setTimeout(() => {
                modalParamModify.style.display = 'none'; // Cacher la modale après l'animation
            }, 500); // Délai correspondant à la durée de l'animation CSS
        });

        const modalParamModifyBody = document.createElement('div');
        modalParamModifyBody.className = 'modal-body';
        // ModalParamBody.id = 'ModalParamBody';
        modalParamModifyContent.appendChild(modalParamModifyBody);

        // Formulaire de modification des paramètres
        const formModify1 = document.createElement('form');
        formModify1.className = 'w-100';
        modalParamModifyBody.appendChild(formModify1);


        // Creation du label pour le nickname
        // const newNicknameLabel = document.createElement('label');
        // newNicknameLabel.className = 'form-label';
        // newNicknameLabel.htmlFor = 'nickname';
        // newNicknameLabel.textContent = 'Nickname';

        // Creation du champ de saisie pour le nickname
        const newNicknameModify = document.createElement('input');
        newNicknameModify.type = 'text';
        newNicknameModify.id = 'nickname';
        newNicknameModify.name = 'newNicknameModify';
        newNicknameModify.className = 'form-control mb-4';
        newNicknameModify.placeholder = 'New nickname';
        formModify1.appendChild(newNicknameModify);

        // Creation du label pour l'email
        // const newEmailLabel = document.createElement('label');
        // newEmailLabel.className = 'form-label';
        // newEmailLabel.htmlFor = 'email';
        // newEmailLabel.textContent = 'Email';

        // Creation du champ de saisie pour l'email
        const newEmailModify = document.createElement('input');
        newEmailModify.type = 'email';
        newEmailModify.id = 'email';
        newEmailModify.name = 'newEmailModify';
        newEmailModify.className = 'form-control mb-4';
        newEmailModify.placeholder = 'New email';
        formModify1.appendChild(newEmailModify);

        // Bouton de soumission
        const submitButtonModify1 = document.createElement('button');
        submitButtonModify1.type = 'submit';
        submitButtonModify1.className = 'btn btn-primary w-100';
        submitButtonModify1.textContent = 'Submit';
        formModify1.appendChild(submitButtonModify1);

        // Gestion de la soumission du formulaire
        formModify1.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche la soumission par défaut du formulaire

            // Suppression des messages précédents
            const errorMessages = avatarForm.querySelectorAll('.text-danger');
            errorMessages.forEach(message => message.remove());
            const successMessages = AccessibilityForm.querySelectorAll('.text-success');
            successMessages.forEach(message => message.remove());

            // Récupération des données du formulaire
            const data = new FormData(formModify1);
            const nickname = data.get('newNicknameModify');
            const email = data.get('newEmailModify');

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
                formModify1.innerHTML = '';
                // const successMessage = document.createElement('p');
                // successMessage.className = 'text-success';
                // successMessage.textContent = 'Paramètres modifiés avec succès';
                // formModify1.appendChild(successMessage);
                navigateTo('/settings');
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Modification error';
                formModify1.insertBefore(errorMessage, submitButtonModify1);
            }
        })

        // Formulaire de modification de l'accessibilité
        const formModify2 = document.createElement('form');
        formModify2.className = 'w-100';
        modalParamModifyBody.appendChild(formModify2);


        // Champ de la taille de la police
        const labelFontSize = document.createElement('label');
        labelFontSize.className = 'form-label';
        // labelFontSize.htmlFor = 'font-size';
        labelFontSize.textContent = 'Font size';
        formModify2.appendChild(labelFontSize);

        // const PoliceContenerSettings = document.createElement('div');
        // PoliceContenerSettings.className = 'LanguageContenerSettings';

        // accessibilityBody.appendChild(LanguageContenerSettings);
        const fontSize = document.createElement('input');
        fontSize.type = 'range';
        fontSize.id = 'font-size';
        fontSize.name = 'font-size';
        fontSize.className = 'form-control-range mb-4 cursor';
        fontSize.min = 1;
        fontSize.max = 3;
        fontSize.value = userData.font_size;
        formModify2.appendChild(fontSize);


        // const exampleElement = document.createElement('p');
        // exampleElement.id = 'example-font-size';
        // exampleElement.textContent = 'Aa';
        // exampleElement.style.fontFamily = "'Quicksand', sans-serif";
        // exampleElement.style.fontSize = `${userData.font_size}rem`;
        // // exampleElement.style.fontSize = '2rem'; // Default value, to be changed by the user's choice later
        // fontSize.addEventListener('input', () => {
        //     exampleElement.style.fontSize = `${fontSize.value}rem`;
        // });
        // formModify2.appendChild(exampleElement);


//     const LanguageContenerSettings = document.createElement('div');
//     LanguageContenerSettings.className = 'LanguageContenerSettings';

//     accessibilityBody.appendChild(LanguageContenerSettings);
//     // Champ de la langue
//     const labelLanguage = document.createElement('label');
//     labelLanguage.className = 'form-label labelLanguageSettings';
//     labelLanguage.htmlFor = 'language';
//     labelLanguage.textContent = 'Langue';

//     const language = document.createElement('select');
//     language.name = 'language';
//     language.id = 'language';
//     language.className = 'form-select selectLanguageSettings';

//     const option1 = document.createElement('option');
//     option1.value = 'fr';
//     option1.textContent = 'Français';
//     language.appendChild(option1);

//     const option2 = document.createElement('option');
//     option2.value = 'en';
//     option2.textContent = 'English';
//     language.appendChild(option2);

//     const option3 = document.createElement('option');
//     option3.value = 'sp';
//     option3.textContent = 'Spanish';
//     language.appendChild(option3);

//     language.value = userData.language;

//     // Champ du mode sombre
//     const DarkModeContenerSettings = document.createElement('div');
//     DarkModeContenerSettings.className = 'DarkModeContenerSettings';

//     accessibilityBody.appendChild(DarkModeContenerSettings);
//     const labelDarkMode = document.createElement('label');
//     labelDarkMode.className = 'form-label';
//     labelDarkMode.htmlFor = 'dark-mode';
//     labelDarkMode.textContent = 'Mode sombre';

//     const darkMode = document.createElement('input');
//     darkMode.type = 'checkbox';
//     darkMode.id = 'dark-mode';
//     darkMode.name = 'dark-mode';
//     darkMode.className = 'form-check-input mb-4';
//     darkMode.checked = userData.theme;

//     // Bouton de validation
//     const accessSubmitButton = document.createElement('button');
//     accessSubmitButton.type = 'submit';
//     accessSubmitButton.className = 'btn btn-primary w-100 Buttonselem';
//     accessSubmitButton.textContent = 'Enregistrer les modifications';

//     // Gestion de la soumission du formulaire
    accessSubmitButton.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Suppression des messages précédents
        const errorMessages = AccessibilityForm.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());
        // const successMessages = AccessibilityForm.querySelectorAll('.text-success');
        // successMessages.forEach(message => message.remove());

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
            // console.error('Error:', error);
        });
        if (response.ok) {
            event.preventDefault();
            navigateTo('/settings');
        }
    })

    });
}



// export function settingsView(container) {
//     container.classList.add('settings-container');
//     container.innerHTML = '';

//     //Appel de la navbar
//     navigationBar(container);

//     const pageTitle = document.createElement('h2');
//     pageTitle.className = 'text-center mb-4 titleWelcome titleSettings';
//     pageTitle.textContent = 'Paramètres';


//     const HeaderSettingsDivFirst = document.createElement('div');
//     HeaderSettingsDivFirst.className = 'HeaderSettingsDivFirst';

const removeAvatarButton = document.createElement('button');
    removeAvatarButton.type = 'submit';
    removeAvatarButton.className = 'btn btn-danger w-100 Buttonselem';
    removeAvatarButton.textContent = 'Supprimer l\'avatar';//     container.appendChild( HeaderSettingsDivFirst);
//     HeaderSettingsDivFirst.appendChild( pageTitle);

//     // Créer une div parent pour regrouper les sections settings, avatar et accessibilité
//     const mainSettingsDiv = document.createElement('div');
//     mainSettingsDiv.className = 'main-settings-div';  // Vous pouvez appliquer des styles spécifiques ici
//     mainSettingsDiv.style.display = 'none';


//     // Recuperer les infos de l'utilisateur dans le backend
//     fetch(`/api/settings/`, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//             'X-CSRFToken': getCookie('csrftoken'),
//         },
//     })
//     // Si le status de la reponse est 200, on recupere les donnees sinon on lance une erreur ou on redirige vers la page de connexion
//     // Si le status est 307 sans passer dans le bloc de donnees
//     .then(response => {
//         if (response.status === 200) {
//             return response.json();
//         }
//         else if (response.status === 307) {
//             localStorage.removeItem('token');
//             fetch('/api/logout/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': getCookie('csrftoken'),
//                 },
//             }).then(r => r.json())
//             navigateTo('/login');
//             return null;
//         } else {
//             throw new Error('Something went wrong');
//         }
//     })
//     .then(data => {
//         if (!data) {
//             return;
//         }
//         const userData = {
//             username: data.username,
//             nickname: data.nickname,
//             email: data.email,
//             language: data.language,
//             font_size: data.font_size,
//             theme: data.dark_mode,
//             avatar: data.avatar,
//         };

// // *************** Affichage des informations personnelles ***************
//         const personalInfo = document.createElement('div');
//         personalInfo.className = 'card mb-4 cardWidget';

//         const personalInfoHeaderContener = document.createElement('div');
//         personalInfoHeaderContener.className = 'card-header personalInfoHeaderContener';
//         const personalInfoHeader = document.createElement('div');
//         personalInfoHeader.className = 'card-header cardTitlewidget';
//         personalInfoHeader.textContent = 'Informations personnelles';
//         const personalInfoIconContener = document.createElement('a');
//         personalInfoIconContener.className = 'personalInfoIconContener';


//         const buttonModifs = document.createElement('button')
//         buttonModifs.className = 'buttonModifs';
//         buttonModifs.addEventListener('click', () => {
//             const mainSettingsDiv = document.querySelector('.main-settings-div');
//             mainSettingsDiv.style.display = 'flex';
//         });

//         const svgpersonalInfoIcon = document.createElement('svg');
//         svgpersonalInfoIcon.setAttribute('xmlns', "http://www.w3.org/2000/svg");
//         svgpersonalInfoIcon.setAttribute('width', '30');
//         svgpersonalInfoIcon.setAttribute('height', '24');
//         svgpersonalInfoIcon.setAttribute('fill', 'currentColor');
//         svgpersonalInfoIcon.setAttribute('class', '"bi bi-pen-fill');
//         svgpersonalInfoIcon.setAttribute('viewBox', '0 0 16 16');

//         buttonModifs.appendChild(svgpersonalInfoIcon);

//         const personalInfoBody = document.createElement('div');
//         personalInfoBody.className = 'card-body cardBodywidget';

//         const avatarItem = document.createElement('div');
//         avatarItem.className = 'list-group-item imgAvatarContener';
//         //avatarItem.textContent = 'Avatar: ';
//         const avatarImage = document.createElement('img');
//         avatarImage.src = `data:image/png;base64, ${userData.avatar}`;
//         avatarImage.className = 'img-fluid rounded-circle imgAvatarProfile';
//         avatarImage.alt = 'Avatar';

//         const personalInfoList = document.createElement('ul');
//         personalInfoList.className = 'list-group list-group-flush cardBodyListElemProfile';
//         const nicknameItem = document.createElement('li');
//         nicknameItem.className = 'list-group-item cardBodyElemProfile';
//         nicknameItem.textContent = `Nickname: ${userData.nickname}`;
//         const emailItem = document.createElement('li');
//         emailItem.className = 'list-group-item cardBodyElemProfile';
//         emailItem.textContent = `Email: ${userData.email}`;

//         ///
//         const languageItem = document.createElement('li');
//         languageItem.className = 'list-group-item';
//         languageItem.textContent = `Langue: ${userData.language}`;

//         const fontSizeItem = document.createElement('li');
//         fontSizeItem.className = 'list-group-item cardBodyElemProfile';
//         fontSizeItem.textContent = `Taille de la police: ${userData.font_size}`;

//         const darkModeItem = document.createElement('li');
//         darkModeItem.className = 'list-group-item cardBodyElemProfile';
//         darkModeItem.textContent = `Mode sombre: ${userData.theme ? 'Activé' : 'Désactivé'}`;

//         avatarItem.appendChild(avatarImage);
//         personalInfoList.appendChild(nicknameItem);
//         personalInfoList.appendChild(emailItem);
//         personalInfoBody.appendChild(avatarItem);
//         personalInfoList.appendChild(languageItem);
//         personalInfoList.appendChild(fontSizeItem);
//         personalInfoList.appendChild(darkModeItem);
//         personalInfoBody.appendChild(personalInfoList);
//         personalInfo.appendChild(personalInfoHeader);
//         personalInfo.appendChild(personalInfoBody); //personalInfoHeaderContener?
//         personalInfo.appendChild(personalInfoHeaderContener);
//         personalInfoHeaderContener.appendChild(personalInfoHeader);
//         personalInfoHeaderContener.appendChild(personalInfoIconContener);
//         personalInfoIconContener.appendChild(buttonModifs); // button
//         HeaderSettingsDivFirst.appendChild(personalInfo);
// // *************** Fin d'affichage des informations personnelles ***************

// // *************** Modification des paramètres ***************
//     // Div pour les paramètres
//     const settingsDiv = document.createElement('div');
//     settingsDiv.className = 'card mb-4';

//     const settingsHeader = document.createElement('div');
//     settingsHeader.className = 'card-header cardTitleModifs';
//     settingsHeader.textContent = 'Modifier les paramètres';

//     const settingsBody = document.createElement('div');
//     settingsBody.className = 'card-body';

//     // Formulaire de modification des paramètres
//     const form = document.createElement('form');
//     form.className = 'w-100';

//     // Creation du label pour le nickname
//     const newNicknameLabel = document.createElement('label');
//     newNicknameLabel.className = 'form-label';
//     newNicknameLabel.htmlFor = 'nickname';
//     newNicknameLabel.textContent = 'Nickname';

//     // Creation du champ de saisie pour le nickname
//     const newNickname = document.createElement('input');
//     newNickname.type = 'text';
//     newNickname.id = 'nickname';
//     newNickname.name = 'newNickname';
//     newNickname.className = 'form-control mb-4';
//     newNickname.placeholder = 'Entrez votre nickname';

//     // Creation du label pour l'email
//     const newEmailLabel = document.createElement('label');
//     newEmailLabel.className = 'form-label';
//     newEmailLabel.htmlFor = 'email';
//     newEmailLabel.textContent = 'Email';

//     // Creation du champ de saisie pour l'email
//     const newEmail = document.createElement('input');
//     newEmail.type = 'email';
//     newEmail.name = 'email';
//     newEmail.id = 'newEmail';  // Pour le label
//     newEmail.className = 'form-control mb-4';
//     newEmail.placeholder = 'Entrez votre email';

//     // Bouton de soumission
//     const submitButton = document.createElement('button');
//     submitButton.type = 'submit';
//     submitButton.className = 'btn btn-primary w-100 Buttonselem';
//     submitButton.textContent = 'Enregistrer les modifications';

//     // Gestion de la soumission du formulaire
//     form.addEventListener('submit', async (event) => {
//         event.preventDefault(); // Empêche la soumission par défaut du formulaire

//         // Suppression des messages précédents
//         const errorMessages = avatarForm.querySelectorAll('.text-danger');
//         errorMessages.forEach(message => message.remove());
//         const successMessages = AccessibilityForm.querySelectorAll('.text-success');
//         successMessages.forEach(message => message.remove());

//         // Récupération des données du formulaire
//         const data = new FormData(form);
//         const nickname = data.get('newNickname');
//         const email = data.get('newEmail');

//         // Envoi des données au serveur
//         const response = await fetch('/api/updateSettings/', {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': getCookie('csrftoken'),
//             },
//             body: JSON.stringify({ nickname, email })
//         });
//         if (response.ok) {
//             form.innerHTML = '';
//             // const successMessage = document.createElement('p');
//             // successMessage.className = 'text-success';
//             // successMessage.textContent = 'Paramètres modifiés avec succès';
//             // form.appendChild(successMessage);
//             navigateTo('/settings');
//         } else {
//             const errorMessage = document.createElement('p');
//             errorMessage.className = 'text-danger';
//             errorMessage.textContent = 'Erreur lors de la modification des paramètres';
//             form.insertBefore(errorMessage, submitButton);
//         }
//     })

//     // Ajout des éléments au DOM
//     settingsDiv.appendChild(settingsHeader);
//     settingsDiv.appendChild(settingsBody);
//     settingsBody.appendChild(form);
//     form.appendChild(newNicknameLabel);
//     form.appendChild(newNickname);
//     form.appendChild(newEmailLabel);
//     form.appendChild(newEmail);
//     form.appendChild(submitButton);
//     container.appendChild(settingsDiv);
// // *************** Fin de modification des paramètres ***************

// // *************** Modification de l'avatar ***************
//     const avatarDiv = document.createElement('div');
//     avatarDiv.className = 'card mb-4';

//     const avatarHeader = document.createElement('div');
//     avatarHeader.className = 'card-header cardTitleModifs';
//     avatarHeader.textContent = 'Modifier l\'avatar';

//     const avatarBody = document.createElement('div');
//     avatarBody.className = 'card-body';

//     // Formulaire de modification de l'avatar
//     const avatarForm = document.createElement('form');
//     avatarForm.className = 'w-100';

//     // Creation du champ de saisie pour l'avatar
//     const newAvatar = document.createElement('input');
//     newAvatar.for = 'avatar';
//     newAvatar.type = 'file';
//     newAvatar.id = 'avatar';
//     newAvatar.name = 'newAvatar';
//     newAvatar.className = 'form-control mb-4';

//     // Bouton de soumission
//     const avatarSubmitButton = document.createElement('button');
//     avatarSubmitButton.type = 'submit';
//     avatarSubmitButton.className = 'btn btn-primary w-100 Buttonselem';
//     avatarSubmitButton.textContent = 'Enregistrer l\'avatar';

//     // Gestion de la soumission du formulaire
//     avatarForm.addEventListener('submit', async (event) => {
//         event.preventDefault(); // Empêche la soumission par défaut du formulaire

//         // Suppression des messages précédents
//         const errorMessages = avatarForm.querySelectorAll('.text-danger');
//         errorMessages.forEach(message => message.remove());
//         const successMessages = AccessibilityForm.querySelectorAll('.text-success');
//         successMessages.forEach(message => message.remove());

//         // Récupération des données du formulaire
//         const data = new FormData(avatarForm);
//         const avatar = data.get('newAvatar');
//         if (!avatar.size || avatar.name === '') {
//             const errorMessage = document.createElement('p');
//             errorMessage.className = 'text-danger';
//             errorMessage.textContent = 'Veuillez choisir un fichier';
//             avatarForm.insertBefore(errorMessage, avatarSubmitButton);
//             return;
//         }
//         if (avatar.size > 1000000) {
//             const errorMessage = document.createElement('p');
//             errorMessage.className = 'text-danger';
//             errorMessage.textContent = 'Fichier trop volumineux (max 1 Mo)';
//             avatarForm.insertBefore(errorMessage, avatarSubmitButton);
//         }
//         // Envoi des données au serveur
//         const response = await fetch('/api/updateAvatar/', {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 'X-CSRFToken': getCookie('csrftoken'),
//             },
//             body: avatar,
//         });
//         if (response.ok) {
//             avatarForm.innerHTML = '';
//             // const successMessage = document.createElement('p');
//             // successMessage.className = 'text-success';
//             // successMessage.textContent = 'Avatar modifié avec succès';
//             // avatarForm.appendChild(successMessage);
//             navigateTo('/settings');

//         } else {
//             const errorMessage = document.createElement('p');
//             errorMessage.className = 'text-danger';
//             errorMessage.textContent = 'Erreur lors de la modification de l\'avatar';
//             avatarForm.insertBefore(errorMessage, avatarSubmitButton);
//         }
//     })

//     // Ajout des éléments au DOM
//     avatarDiv.appendChild(avatarHeader);
//     avatarDiv.appendChild(avatarBody);
//     avatarBody.appendChild(avatarForm);
//     avatarForm.appendChild(newAvatar);
//     avatarForm.appendChild(avatarSubmitButton);
//     container.appendChild(avatarDiv);
// // *************** Fin de modification de l'avatar ***************

// // *************** Modification de l'accessibilité ***************
//     const accessibilityDiv = document.createElement('div');
//     accessibilityDiv.className = 'card mb-4';

//     const accessibilityHeader = document.createElement('div');
//     accessibilityHeader.className = 'card-header cardTitleModifs';
//     accessibilityHeader.textContent = 'Accessibilité';

//     const accessibilityBody = document.createElement('div');
//     accessibilityBody.className = 'card-body';

//     // Formulaire de modification de l'accessibilité
//     const AccessibilityForm = document.createElement('form');
//     AccessibilityForm.className = 'w-100';


//     const PoliceContener = document.createElement('div');
//     PoliceContener.className = 'PoliceContener';

//     AccessibilityForm.appendChild(PoliceContener);
//     // Champ de la taille de la police
//     const labelFontSize = document.createElement('label');
//     labelFontSize.className = 'form-label';
//     labelFontSize.htmlFor = 'font-size';
//     labelFontSize.textContent = 'Taille de la police';

//     const fontSize = document.createElement('input');
//     fontSize.type = 'range';
//     fontSize.id = 'font-size';
//     fontSize.name = 'font-size';
//     fontSize.className = 'form-control-range mb-4 cursor';
//     fontSize.min = 1;
//     fontSize.max = 3;
//     fontSize.value = userData.font_size;

//     const exampleElement = document.createElement('p');
//     exampleElement.id = 'example-font-size';
//     exampleElement.textContent = 'Aa';
//     exampleElement.style.fontFamily = "'Quicksand', sans-serif";
//     exampleElement.style.fontSize = `${userData.font_size}rem`;
//     // exampleElement.style.fontSize = '2rem'; // Default value, to be changed by the user's choice later
//     fontSize.addEventListener('input', () => {
//         exampleElement.style.fontSize = `${fontSize.value}rem`;
//     });


//     const LanguageContenerSettings = document.createElement('div');
//     LanguageContenerSettings.className = 'LanguageContenerSettings';

//     accessibilityBody.appendChild(LanguageContenerSettings);
//     // Champ de la langue
//     const labelLanguage = document.createElement('label');
//     labelLanguage.className = 'form-label labelLanguageSettings';
//     labelLanguage.htmlFor = 'language';
//     labelLanguage.textContent = 'Langue';

//     const language = document.createElement('select');
//     language.name = 'language';
//     language.id = 'language';
//     language.className = 'form-select selectLanguageSettings';

//     const option1 = document.createElement('option');
//     option1.value = 'fr';
//     option1.textContent = 'Français';
//     language.appendChild(option1);

//     const option2 = document.createElement('option');
//     option2.value = 'en';
//     option2.textContent = 'English';
//     language.appendChild(option2);

//     const option3 = document.createElement('option');
//     option3.value = 'sp';
//     option3.textContent = 'Spanish';
//     language.appendChild(option3);

//     language.value = userData.language;

//     // Champ du mode sombre
//     const DarkModeContenerSettings = document.createElement('div');
//     DarkModeContenerSettings.className = 'DarkModeContenerSettings';

//     accessibilityBody.appendChild(DarkModeContenerSettings);
//     const labelDarkMode = document.createElement('label');
//     labelDarkMode.className = 'form-label';
//     labelDarkMode.htmlFor = 'dark-mode';
//     labelDarkMode.textContent = 'Mode sombre';

//     const darkMode = document.createElement('input');
//     darkMode.type = 'checkbox';
//     darkMode.id = 'dark-mode';
//     darkMode.name = 'dark-mode';
//     darkMode.className = 'form-check-input mb-4';
//     darkMode.checked = userData.theme;

//     // Bouton de validation
//     const accessSubmitButton = document.createElement('button');
//     accessSubmitButton.type = 'submit';
//     accessSubmitButton.className = 'btn btn-primary w-100 Buttonselem';
//     accessSubmitButton.textContent = 'Enregistrer les modifications';

//     // Gestion de la soumission du formulaire
//     accessSubmitButton.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         // Suppression des messages précédents
//         const errorMessages = AccessibilityForm.querySelectorAll('.text-danger');
//         errorMessages.forEach(message => message.remove());
//         // const successMessages = AccessibilityForm.querySelectorAll('.text-success');
//         // successMessages.forEach(message => message.remove());

//         // Récupération des données du formulaire
//         const data = new FormData(AccessibilityForm);
//         const font_size = data.get('font-size');
//         const language = data.get('language');
//         const dark_mode = data.get('dark-mode');

//         // Envoi des données au serveur
//         const response = await fetch('/api/updateAccessibility/', {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': getCookie('csrftoken'),
//             },
//             body: JSON.stringify({ font_size, language, dark_mode })
//         })
//         .catch((error) => {
//             const errorMessage = document.createElement('p');
//             errorMessage.className = 'text-danger';
//             errorMessage.textContent = 'Erreur lors de la modification des paramètres';
//             AccessibilityForm.insertBefore(errorMessage, accessSubmitButton);
//             // console.error('Error:', error);
//         });
//         if (response.ok) {
//             event.preventDefault();
//             navigateTo('/settings');
//         }
//     })

//     // Ajout des éléments au DOM
//     accessibilityDiv.appendChild(accessibilityHeader);
//     accessibilityDiv.appendChild(accessibilityBody);
//     accessibilityBody.appendChild(AccessibilityForm);
//     PoliceContener.appendChild(labelFontSize);
//     PoliceContener.appendChild(fontSize);
//     AccessibilityForm.appendChild(exampleElement);
//     LanguageContenerSettings.appendChild(labelLanguage);
//     LanguageContenerSettings.appendChild(language);
//     DarkModeContenerSettings.appendChild(labelDarkMode);
//     DarkModeContenerSettings.appendChild(darkMode);
//     AccessibilityForm.appendChild(accessSubmitButton);

//     mainSettingsDiv.appendChild(settingsDiv);
//     mainSettingsDiv.appendChild(avatarDiv);
//     mainSettingsDiv.appendChild(accessibilityDiv);

//     container.appendChild(mainSettingsDiv);
// // *************** Fin de modification de l'accessibilité ***************


// // *************** Modification du mot de passe ***************

//     const ButtonsSettings = document.createElement('div');
//     ButtonsSettings.className = 'ButtonsSettings';

//     // Bouton de redirection vers la page de modification du mot de passe
//     const passwordButton = document.createElement('button');
//     passwordButton.textContent = 'Modifier le mot de passe';
//     passwordButton.className = 'btn btn-primary Buttonselem';
//     passwordButton.addEventListener('click', (event) => {
//         event.preventDefault();
//         navigateTo('/password');
//     });


//     ButtonsSettings.appendChild(passwordButton);
//     container.appendChild(ButtonsSettings);
// // *************** Fin de modification du mot de passe ***************


// // *************** Deconnexion ***************
//     const logoutButton = document.createElement('button');
//     logoutButton.textContent = 'Logout';
//     logoutButton.className = 'btn btn-danger Buttonselem ButtonLogOut';
//     logoutButton.addEventListener('click', (event) => {
//         fetch('/api/logout/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': getCookie('csrftoken'),
//             },
//         })
//         .then(response => response.json())
//         .then(data => {
//             localStorage.removeItem('token');
//             event.preventDefault();
//             navigateTo('/login');
//         });
//     });
//     ButtonsSettings.appendChild(logoutButton);
// // *************** Fin de deconnexion ***************
//     });
// }