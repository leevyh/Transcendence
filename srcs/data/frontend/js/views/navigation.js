import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';

function displayFriends(friends) {
    console.log(friends);
    const divListFriends = document.querySelector('.divListFriends');
    divListFriends.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'list-unstyled d-flex flex-column friends_ul';

    // Sort friends by status and if all are offline or online, sort by nickname

    // friends.sort((a, b) => {
    //     if (a.status === b.status) {
    //         return a.nickname.localeCompare(b.nickname); TODO : CHECK IF IT WORKS
    //     }
    //     return a.status.localeCompare(b.status);
    // });

    friends = friends.sort((a, b) => {
        if (a.status === 'online' && b.status !== 'online') {
            return -1;
        } else if (a.status !== 'online' && b.status === 'online') {
            return 1;
        } else {
            return 0;
        }
    });

    divListFriends.appendChild(ul);
    friends.forEach(friend => {
        const li = document.createElement('li');
        li.className = 'friendItem';
        const cardFriend = document.createElement('div');
        cardFriend.className = 'card d-flex flex-row align-items-center p-2 shadow-sm';

        const avatarFriend = document.createElement('img');
        avatarFriend.src = `data:image/png;base64, ${friend.avatar}`;
        avatarFriend.className = 'avatarFriend rounded-circle';
        avatarFriend.alt = 'Friend Avatar';
        cardFriend.appendChild(avatarFriend);

        const infoFriend = document.createElement('div');
        infoFriend.className = 'ms-3';

        const nicknameFriend = document.createElement('span');
        nicknameFriend.className = 'friend-name mb-1';
        nicknameFriend.textContent = friend.nickname;
        infoFriend.appendChild(nicknameFriend);

        const statusFriend = document.createElement('small');
        statusFriend.className = 'friends_status';
        statusFriend.textContent = friend.status;
        infoFriend.appendChild(statusFriend);

        cardFriend.appendChild(infoFriend);
        li.appendChild(cardFriend);
        ul.appendChild(li);
    });
}

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
            console.error('Error:', response);
            // throw new Error('Something went wrong');
        }
    })
    .then(data => {
        if (!data) {
           console.error('No data received');
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

        const friends_websocket = new WebSocket(`ws://${window.location.host}/ws/friends/`);
        friends_websocket.onopen = () => {
            console.log('WebSocket connection established');
            friends_websocket.send(JSON.stringify({ type: 'get_friends' }));
        }

        friends_websocket.onmessage = event => {
            const message = JSON.parse(event.data);
            if (message.type === 'get_friends') {
                // Display the list of friends
                displayFriends(message.friends);
            }
        };

        friends_websocket.onclose = () => {
            console.error('WebSocket connection closed.');
        };

        // On WebSocket error
        friends_websocket.onerror = error => {
            console.error('WebSocket error:', error);
        };


        // Creation of the navigation bar
        const nav = document.createElement('nav');
        nav.className = 'nav d-flex flex-column justify-content-start align-items-center shadow-lg';
        nav.style.backgroundColor = '#435574';
        div.appendChild(nav);

        const divProfile = document.createElement('div');
        divProfile.className = 'divProfile w-50 text-center';
        nav.appendChild(divProfile);

        const avatarItem = document.createElement('div');
        avatarItem.className = 'avatarItem rounded-circle overflow-hidden';
        avatarItem.style.display = 'flex';
        avatarItem.style.alignItems = 'center';
        avatarItem.style.justifyContent = 'center';
        avatarItem.style.position = 'relative';
        divProfile.appendChild(avatarItem);

        const avatarImage = document.createElement('img');
        avatarImage.src = `data:image/png;base64, ${userData.avatar}`;
        avatarImage.className = 'avatarImage w-100 h-auto pb-2';
        avatarImage.setAttribute('tabindex', '0');
        avatarImage.setAttribute('role', 'button');
        avatarImage.alt = 'Avatar';
        avatarItem.appendChild(avatarImage);

        const SVGModifyAvatar = document.createElement('svg');
        SVGModifyAvatar.className = 'SVGModifyAvatar bi bi-pencil-fill position-absolute';
        SVGModifyAvatar.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        SVGModifyAvatar.setAttribute('width', '32');
        SVGModifyAvatar.setAttribute('height', '32');
        SVGModifyAvatar.setAttribute('fill', 'white');
        SVGModifyAvatar.setAttribute('viewBox', '0 0 16 16');
        SVGModifyAvatar.style.opacity = '0';

        SVGModifyAvatar.innerHTML = `
            <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9.146 9.146L5 13.5l.5-.5 9.146-9.146zM4 13.5V15h1.5l.146-.146L4 13.5zm-3.5.5a.5.5 0 0 1 0-1H1V12.5H.5a.5.5 0 0 1 0-1H1V11H.5a.5.5 0 0 1 0-1H1V9.5H.5a.5.5 0 0 1 0-1H1V8.5H.5a.5.5 0 0 1 0-1H1V7.5H.5a.5.5 0 0 1 0-1H1V6.5H.5a.5.5 0 0 1 0-1H1V5.5H.5a.5.5 0 0 1 0-1H1V4.5H.5a.5.5 0 0 1 0-1H1V3.5H.5a.5.5 0 0 1 0-1H1V2.5H.5a.5.5 0 0 1 0-1H1V1.5H.5a.5.5 0 0 1 0-1H1V.5H.5a.5.5 0 0 1 0-1H1V0h-.5a.5.5 0 0 1 0 1H1V.5H.5z"/>
        `;

        avatarItem.appendChild(SVGModifyAvatar);

        avatarImage.addEventListener('mouseover', () => {
            avatarImage.style.filter = 'blur(5px)';
            SVGModifyAvatar.style.opacity = '1';
        });

        avatarImage.addEventListener('mouseout', () => {
            avatarImage.style.filter = 'none';
            SVGModifyAvatar.style.opacity = '0';
        });


        avatarImage.addEventListener('click', () => {

            const bootstrapModal = new bootstrap.Modal(modalAvatar);

            const navBar = document.querySelector('.nav');
            const rect = navBar.getBoundingClientRect();

            modalAvatar.style.position = 'absolute';
            modalAvatar.style.top = `${rect.top}px`;
            modalAvatar.style.left = `${rect.right + 10}px`;

            modalAvatar.style.margin = '0';
            modalAvatar.style.transform = 'none';
            modalAvatar.style.maxWidth = 'none';
            bootstrapModal.show();
        });

        //////CREATION MODAL AVATAR TRY///////////////////////////////

    const modalAvatar = document.createElement('div');
    modalAvatar.className = 'modal fade modalAvatar';
    modalAvatar.id = 'modalAvatar';
    modalAvatar.setAttribute('tabindex', '-1');
    modalAvatar.setAttribute('aria-labelledby', 'modalAvatarLabel');
    modalAvatar.setAttribute('aria-hidden', 'true');
    container.appendChild(modalAvatar);

    const modalAvatarDialog = document.createElement('div');
    modalAvatarDialog.className = "modal-dialog modalAvatarDialog";
    modalAvatar.appendChild(modalAvatarDialog);

    const modalAvatarContent = document.createElement('div');
    modalAvatarContent.className = 'modal-content modalAvatarContent';
    modalAvatarDialog.appendChild(modalAvatarContent);

    const modalAvatarHeader = document.createElement('div');
    modalAvatarHeader.className = 'modal-header border-bottom border-custom-color pb-2 modalAvatarHeader';
    modalAvatarContent.appendChild(modalAvatarHeader);

    const modalAvatarTitle = document.createElement('h2');
    modalAvatarTitle.textContent = 'Avatar';
    modalAvatarTitle.className = 'modal-title modalAvatarTitle';
    modalAvatarHeader.appendChild(modalAvatarTitle);

    const modalAvatarCloseButton = document.createElement('span');
    modalAvatarCloseButton.id = 'closeButtonAvatar';
    modalAvatarCloseButton.setAttribute('data-bs-dismiss', 'modal');
    modalAvatarCloseButton.setAttribute('aria-label', 'Close');
    modalAvatarCloseButton.textContent = '×';
    modalAvatarHeader.appendChild(modalAvatarCloseButton);

    modalAvatarCloseButton.addEventListener('click', () => {
        modalAvatar.classList.remove('modalAvatar-show');
        setTimeout(() => {
            modalAvatar.style.display = 'none';
        }, 500);
    });

    const modalAvatarBody = document.createElement('div');
    modalAvatarBody.className = 'modal-body';
    modalAvatarContent.appendChild(modalAvatarBody);

    const avatarForm = document.createElement('form');
    avatarForm.className = 'w-100';
    modalAvatarBody.appendChild(avatarForm);

    const newAvatar = document.createElement('input');
    newAvatar.type = 'file';
    newAvatar.id = 'avatar';
    newAvatar.name = 'newAvatar';
    newAvatar.className = 'form-control mb-4';
    avatarForm.appendChild(newAvatar);

    const avatarSubmitButton = document.createElement('button');
    avatarSubmitButton.type = 'submit';
    avatarSubmitButton.className = 'btn btn-primary w-100 mb-3 d-flex justify-content-center align-items-center';
    avatarSubmitButton.textContent = 'Save avatar';
    avatarForm.appendChild(avatarSubmitButton);

    const removeAvatarButton = document.createElement('button');
    removeAvatarButton.type = 'button';
    removeAvatarButton.className = 'btn btn-danger w-100';
    removeAvatarButton.textContent = 'Remove avatar';
    avatarForm.appendChild(removeAvatarButton);

    // Action du bouton "Save avatar"
    avatarForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire

        // Suppression des messages précédents
        const errorMessages = accessibilityForm.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());
        const successMessages = accessibilityForm.querySelectorAll('.text-success');
        successMessages.forEach(message => message.remove());

        // Récupération du fichier sélectionné
        const data = new FormData(avatarForm);
        const avatarFile = data.get('newAvatar');

        if (!avatarFile.size || avatarFile.name === '') {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Select a file';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
            return;
        }

        //Check file type
        if (!avatarFile.type.startsWith('image/')) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'File type not supported';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
            return;
        }

        if (avatarFile.size > 1000000) { // Vérification de la taille (1 MB max)
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'File too large (max 1 MB)';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
            return;
        }

        try {
            const response = await fetch('/api/updateAvatar/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: avatarFile,
            });

            if (response.ok) {
                const result = await response.json(); // Suppose que l'URL de l'avatar est retournée

                // Message de succès
                const successMessage = document.createElement('p');
                successMessage.className = 'text-success';
                successMessage.textContent = 'Avatar successfully modified';
                avatarForm.appendChild(successMessage);

                setTimeout(() => {
                    const modalElement = document.getElementById('modalAvatar');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();

                    document.body.style.filter = 'blur(5px)';

                    let location = window.location.href;
                    const str_split = location.split('/');
                    const length = str_split.length;
                    const locationFinal = '/' + str_split[length - 1];
                    navigateTo(locationFinal);

                    let blurAmount = 4;
                    const interval = setInterval(() => {
                        blurAmount -= 0.1;
                        document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

                        if (blurAmount <= 0) {
                            clearInterval(interval);
                        }
                    }, 25);
                }, 800);

            } else {
                // Message d'erreur en cas d'échec
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Error when modifying the avatar';
                avatarForm.insertBefore(errorMessage, avatarSubmitButton);

                setTimeout(() => {
                    const modalElement = document.getElementById('modalAvatar');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();

                    document.body.style.filter = 'blur(5px)';

                    let location = window.location.href;
                    const str_split = location.split('/');
                    const length = str_split.length;
                    const locationFinal = '/' + str_split[length - 1];
                    navigateTo(locationFinal);

                    let blurAmount = 4;
                    const interval = setInterval(() => {
                        blurAmount -= 0.1;
                        document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

                        if (blurAmount <= 0) {
                            clearInterval(interval);
                        }
                    }, 25);
                }, 800);
            }
        } catch (error) {
            console.error('Error during the avatar update', error);
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'An error occurred while updating the avatar';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);

            setTimeout(() => {
                const modalElement = document.getElementById('modalAvatar');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();

                document.body.style.filter = 'blur(5px)';

                let location = window.location.href;
                const str_split = location.split('/');
                const length = str_split.length;
                const locationFinal = '/' + str_split[length - 1];
                navigateTo(locationFinal);

                let blurAmount = 4;
                const interval = setInterval(() => {
                    blurAmount -= 0.1;
                    document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

                    if (blurAmount <= 0) {
                        clearInterval(interval);
                    }
                }, 25);
            }, 800);
        }
    });

    // Action du bouton "Remove avatar" pour supprimer l'avatar actuel
    removeAvatarButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/deleteAvatar/', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            // Suppression des messages précédents
            const errorMessages = accessibilityForm.querySelectorAll('.text-danger');
            errorMessages.forEach(message => message.remove());
            const successMessages = accessibilityForm.querySelectorAll('.text-success');
            successMessages.forEach(message => message.remove());
            if (response.ok) {
                // Mettre à jour l'avatar avec une image par défaut après suppression
                const avatarImage = document.querySelector('.avatarImage');
                avatarImage.src = '/path/to/default-avatar.png';  // Remplacer par l'URL de l'avatar par défaut

                // Afficher un message de succès
                const successMessage = document.createElement('p');
                successMessage.className = 'text-success';
                successMessage.textContent = 'Avatar successfully removed';
                avatarForm.appendChild(successMessage);

                setTimeout(() => {
                    const modalElement = document.getElementById('modalAvatar');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();

                    document.body.style.filter = 'blur(5px)';

                    let location = window.location.href;
                    const str_split = location.split('/');
                    const length = str_split.length;
                    const locationFinal = '/' + str_split[length - 1];
                    navigateTo(locationFinal);

                    let blurAmount = 4;
                    const interval = setInterval(() => {
                        blurAmount -= 0.1;
                        document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

                        if (blurAmount <= 0) {
                            clearInterval(interval);
                        }
                    }, 25);
                }, 800);

            } else {
                // Message d'erreur si suppression échoue
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Error when removing the avatar';
                avatarForm.appendChild(errorMessage);

                setTimeout(() => {
                    const modalElement = document.getElementById('modalAvatar');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();

                    document.body.style.filter = 'blur(5px)';

                    let location = window.location.href;
                    const str_split = location.split('/');
                    const length = str_split.length;
                    const locationFinal = '/' + str_split[length - 1];
                    navigateTo(locationFinal);

                    let blurAmount = 4;
                    const interval = setInterval(() => {
                        blurAmount -= 0.1;
                        document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

                        if (blurAmount <= 0) {
                            clearInterval(interval);
                        }
                    }, 25);
                }, 800);
            }

        } catch (error) {
            console.error('Error during the avatar removal', error);
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'An error occurred while removing the avatar';
            avatarForm.appendChild(errorMessage);

            setTimeout(() => {
                const modalElement = document.getElementById('modalAvatar');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();

                document.body.style.filter = 'blur(5px)';

                let location = window.location.href;
                const str_split = location.split('/');
                const length = str_split.length;
                const locationFinal = '/' + str_split[length - 1];
                navigateTo(locationFinal);

                let blurAmount = 4;
                const interval = setInterval(() => {
                    blurAmount -= 0.1;
                    document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

                    if (blurAmount <= 0) {
                        clearInterval(interval);
                    }
                }, 25);
            }, 800);
        }
    });

////////////////////////////////////////////////////////////////////////////////////
        const TitleNickname = document.createElement('h4');
        TitleNickname.className = 'TitleNickname mt-2 pb-4';
        TitleNickname.textContent = `${userData.nickname}`;
        TitleNickname.setAttribute('tabindex', '0');
        TitleNickname.setAttribute('role', 'button');
        divProfile.appendChild(TitleNickname);

        // Navigation list
        const divNav = document.createElement('div');
        divNav.className = 'divNav border-top border-2 border-bottom border-custom-color py-3 w-100';
        nav.appendChild(divNav);

        const NavBarList = document.createElement('ul');
        NavBarList.className = 'NavBarList list-unstyled d-flex flex-column';
        divNav.appendChild(NavBarList);

        NavBarList.appendChild(createNavButton('Pong', () => navigateTo('/pong')));
        NavBarList.appendChild(createNavButton('Chat', () => navigateTo('/chat')));
        NavBarList.appendChild(createNavButton('Users', () => navigateTo('/users')));
        NavBarList.appendChild(createNavButton('Leaderboard', () => navigateTo('/leaderboard')));

        // Friends list
        const divListFriends = document.createElement('div');
        divListFriends.className = 'divListFriends d-flex justify-content-center w-100 py-3';
        divListFriends.style.overflowY = 'auto';
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
        divFontSize.className = 'divFontSize d-flex flex-column';
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
        fontSize.className = 'form-control-range mb-2 cursor align-self-center fontSizeCursor';
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
        optionFr.textContent = 'Francais';
        language.appendChild(optionFr);

        const optionEs = document.createElement('option');
        optionEs.value = 'es';
        optionEs.textContent = 'Espanol';
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

function createNavButton(text, onClick) {
    const listItem = document.createElement('li');
    listItem.className = 'ElemListNavBar text-center py-2';

    const button = document.createElement('button');
    button.className = 'btn text-primary';
    button.textContent = text;

    // Remove the outline when the button loses focus
    button.addEventListener('blur', () => {
        button.style.outline = 'none';
    });

    listItem.appendChild(button);

    button.addEventListener('click', () => {
        if (DEBUG) {console.log(`Navigating to ${text}`, 'actual:', window.location.pathname);}
        if (window.location.pathname === `/${text.toLowerCase()}`) {
            return;
        }
        onClick();
    });

    return listItem;
}
