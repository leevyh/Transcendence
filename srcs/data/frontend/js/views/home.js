import { DEBUG, navigateTo } from '../app.js';
import { getCookie } from './utils.js';

export function homeView(container) {

    container.innerHTML = '';

    const base = document.createElement('div');
    base.className = 'base navbarr';
    container.appendChild(base);

    const cardHome = document.createElement('div');
    cardHome.className = 'card text-center bg-transparent cardHome';
    base.appendChild(cardHome);

    const cardHomeTitle = document.createElement('div');
    cardHomeTitle.className = 'card-header fs-1 mb-5 pb-5 cardHomeTitle';
    cardHomeTitle.textContent = 'Pong Site';
    cardHome.appendChild(cardHomeTitle);

    const cardHomeBody = document.createElement('div');
    cardHomeBody.className = 'd-flex flex-column justify-content-center align-items-center mt-5 pt-5';
    cardHome.appendChild(cardHomeBody);

    const ButtonLoginHome = document.createElement('button');
    ButtonLoginHome.className = 'btn btn-primary btn-lg m-3 px-5 py-3 ButtonsHome';
    ButtonLoginHome.textContent = 'Login';
    cardHomeBody.appendChild(ButtonLoginHome);

    const ButtonRegisterHome = document.createElement('button');
    ButtonRegisterHome.className = 'btn btn-primary btn-lg m-3 px-5 py-3 ButtonsHome';
    ButtonRegisterHome.textContent = 'Register';
    cardHomeBody.appendChild(ButtonRegisterHome);

    ///////////////////////////////////////////////////////////////
    // Modal-Login
    const modalLogin = document.createElement('div');
    modalLogin.className = 'modal ModalLoginBase';
    modalLogin.setAttribute('tabindex', '-1');
    modalLogin.setAttribute('aria-labelledby', 'modalLoginLabel');
    modalLogin.setAttribute('aria-hidden', 'true');
    modalLogin.style.display = 'none'; // Initialement caché
    container.appendChild(modalLogin);

    const modalLoginDialog = document.createElement('div');
    modalLoginDialog.className = 'modal-dialog-centered d-flex justify-content-center align-items-center modalLoginDialog';
    modalLogin.appendChild(modalLoginDialog);

    const modalLoginContent = document.createElement('div');
    modalLoginContent.className = 'modal-content modalLoginContent';
    modalLoginDialog.appendChild(modalLoginContent);

    const modalLoginHeader = document.createElement('div');
    modalLoginHeader.className = 'modal-header pb-2 border border-0 modalLoginHeader';
    modalLoginContent.appendChild(modalLoginHeader);

    const modalLoginTitle = document.createElement('h2');
    modalLoginTitle.textContent = 'Login';
    modalLoginTitle.className = 'modal-title modalLoginTitle';
    modalLoginHeader.appendChild(modalLoginTitle);

    const closeButtonLogin = document.createElement('span');
    closeButtonLogin.id = 'closeButtonLogin';
    closeButtonLogin.setAttribute('aria-label', 'Close');
    closeButtonLogin.textContent = '×';
    modalLoginHeader.appendChild(closeButtonLogin);



    closeButtonLogin.addEventListener('click', () => {
        modalLogin.classList.remove('ModalLoginBase-show');
        setTimeout(() => {
            modalLogin.style.display = 'none';
        }, 500);
    });

    const modalLoginBody = document.createElement('div');
    modalLoginBody.className = 'modal-body';
    modalLoginContent.appendChild(modalLoginBody);

    const formLogin = document.createElement('form');

    const fields = [
        { label: "Username", type: 'text', id: 'username', placeholder: "Your Username" },
        { label: 'Password', type: 'password', id: 'password', placeholder: 'Your Password' },
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
        formLogin.appendChild(formGroup);
    });
    modalLoginBody.appendChild(formLogin);

    const submitLoginButton = document.createElement('button');
    submitLoginButton.type = 'submit';
    submitLoginButton.className = 'btn btn-primary w-100 ButtonLogin mb-3';
    submitLoginButton.textContent = 'Sign in';
    formLogin.appendChild(submitLoginButton);

    formLogin.addEventListener('submit', (event) => {
        event.preventDefault();

        const errorMessages = formLogin.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'All fields are required';
            formLogin.insertBefore(errorMessage, submitLoginButton);
            return;
        }

        fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ username, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'User logged in successfully') {
                    localStorage.setItem('token', data.token);
                    window.dispatchEvent(new Event('userAuthenticated'));
                    modalLogin.classList.remove('ModalLoginBase-show');
                    setTimeout(() => {
                        modalLogin.style.display = 'none';
                    }, 500);
                    navigateTo('/profile');///////////
                } else if (data.error) {
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'text-danger';
                    errorMessage.textContent = 'Bad password or Username';
                    formLogin.insertBefore(errorMessage, submitLoginButton);
                }
            })
            .catch(error => {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'An error has occurred. Please try again.';
                formLogin.insertBefore(errorMessage, submitLoginButton);
            });
    });

    // Connection avec 42
    const buttonLogin42 = document.createElement('button');
    buttonLogin42.className = 'btn btn-dark w-100 ButtonLogin42';
    buttonLogin42.textContent = 'Sign in with 42';
    formLogin.appendChild(buttonLogin42);

    buttonLogin42.addEventListener('click', (event) => {
        event.preventDefault();
        fetch('/api/auth/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.url) {
                    window.location.href = data.url;
                }
            })
            .catch(error => {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'An error has occurred. Please try again.';
                formLogin.appendChild(errorMessage);
            });
    });
    // // Ajout de l'événement pour afficher la modal
    ButtonLoginHome.addEventListener('mousedown', () => {
        modalLogin.style.display = 'block'; // Affiche la modal
        setTimeout(() => {
            modalLogin.classList.add('ModalLoginBase-show'); // Ajoute la classe pour l'animation
        }, 10); // Légère temporisation pour l'effet d'animation
    });

    /////////////////////////////////////////////////////////////////

    // Modal-Register
    const modalRegister = document.createElement('div');
    modalRegister.className = 'modal ModalRegisterBase';
    modalRegister.style.display = 'none'; // Cachée par défaut
    container.appendChild(modalRegister);

    const modalRegisterDialog = document.createElement('div');
    modalRegisterDialog.className = 'modal-dialog-centered d-flex justify-content-center align-items-center modal-md modalRegisterDialog';
    modalRegister.appendChild(modalRegisterDialog);

    // Créer le contenu de la modale
    const modalRegisterContent = document.createElement('div');
    modalRegisterContent.className = 'modal-content text-body w-auto ModalRegisterContent';
    modalRegisterDialog.appendChild(modalRegisterContent);

    const modalRegisterHeader = document.createElement('div');
    modalRegisterHeader.className = 'modal-header pb-2 border border-0 modalLoginHeader';
    modalRegisterContent.appendChild(modalRegisterHeader);

        // Titre du formulaire
    const modalRegisterTitle = document.createElement('h2');
    modalRegisterTitle.textContent = 'Register';
    modalRegisterTitle.className = 'modalLoginTitle'
    modalRegisterHeader.appendChild(modalRegisterTitle);

    // Bouton pour fermer la modale
    const closeRegisterButton = document.createElement('span');
    closeRegisterButton.className = 'closeRegisterButton';
    closeRegisterButton.textContent = '×'; // Symbole de fermeture
    modalRegisterHeader.appendChild(closeRegisterButton);

    closeRegisterButton.addEventListener('click', () => {
        modalRegister.classList.remove('modalRegisterBase-show');
        setTimeout(() => {
            modalRegister.style.display = 'none';
        }, 50);
    });

    const modalRegisterBody = document.createElement('div');
    modalRegisterBody.className = 'modal-body modalRegisterBody';
    modalRegisterContent.appendChild(modalRegisterBody);

    // Créer le formulaire
    const formRegister = document.createElement('form');
    formRegister.className = 'formRegister';
    modalRegisterBody.appendChild(formRegister);
    // Champs du formulaire
    const fieldsRegister = [
        { label: 'Username' , type: 'text', id: 'usernameRe', placeholder: 'Your username' },
        { label: 'Nickname', type: 'text', id: 'nicknameRe', placeholder: 'Your nickname' },
        { label: 'Mail address', type: 'email', id: 'emailRe', placeholder: 'Your mail address' },
        { label: 'Password', type: 'password', id: 'passwordRe', placeholder: 'Your password' },
        { label: 'Confirm password ', type: 'password', id: 'confirmpasswordRe', placeholder: 'Your password' },
    ];

    fieldsRegister.forEach(fieldRegister => {
        const formGroup = document.createElement('div');
        formGroup.className = 'mb-3';
        formRegister.appendChild(formGroup);

        const label = document.createElement('label');
        label.className = 'form-label titleLabelRegister';
        label.htmlFor = fieldRegister.id;
        label.textContent = fieldRegister.label;
        formGroup.appendChild(label);

        const input = document.createElement('input');
        input.type = fieldRegister.type;
        input.className = 'form-control FormChamp';
        input.id = fieldRegister.id;
        input.placeholder = fieldRegister.placeholder;

        formGroup.appendChild(input);

    });


    // Bouton de soumission
    const submitRegisterButton = document.createElement('button');
    submitRegisterButton.setAttribute('type', 'submit');
    submitRegisterButton.className = 'btn btn-primary w-100 submit ButtonLogin ButtonRegisterSubmit';
    submitRegisterButton.textContent = "Register";
    formRegister.appendChild(submitRegisterButton);

    formRegister.addEventListener('submit', (event) => {
        event.preventDefault();

        // Suppression des messages d'erreur précédents
        const errorMessages = formRegister.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());

        // Récupérer les valeurs des champs ajoutés dans le formulaire
        const usernameRe = document.getElementById('usernameRe').value;
        const nicknameRe = document.getElementById('nicknameRe').value;
        const emailRe = document.getElementById('emailRe').value;
        const passwordRe = document.getElementById('passwordRe').value;
        const confirmPasswordRe = document.getElementById('confirmpasswordRe').value;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
        // Si un champ est vide
        if (!usernameRe || !nicknameRe || !emailRe || !passwordRe || !confirmPasswordRe) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'All fields are required';
            formRegister.insertBefore(errorMessage, submitRegisterButton);
            return;
        }
        // Si Passwords don't match
        else if (passwordRe !== confirmPasswordRe) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Password do not match';
            formRegister.insertBefore(errorMessage, submitRegisterButton);
            return;
        }
        // Si le nouveau mot de passe a la bonne forme
        // else if (!passwordRegex.test(password)) {
        //     const errorMessage = document.createElement('p');
        //     errorMessage.className = 'text-danger';
        //     errorMessage.textContent = 'Le mot de passe doit contenir entre 8 et 12 caractères, au moins une lettre majuscule, une lettre minuscule et un chiffre';
        //     formRegister.insertBefore(errorMessage, submitRegisterButton);
        //     return;
        // }


        // Envoi des données du formulaire
        fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(
                {
                    username: usernameRe,
                    password: passwordRe,
                    nickname: nicknameRe,
                    email: emailRe,
                    // language: 'en'
                }
            )
        })
        .then(response => {
            if (!response.ok) {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Error while registering, please try again';
                formRegister.insertBefore(errorMessage, submitRegisterButton);
            }
            else {
                // Si l'inscription est réussie, on ferme la modale et on ouvre la modale de connexion
                modalRegister.classList.remove('ModalLoginBase-show');
                setTimeout(() => {
                    modalRegister.style.display = 'none';
                }, 500); // Même délai pour l'animation de fermeture
                modalRegister.classList.add('ModalLoginBase-show');
                setTimeout(() => {
                    modalRegister.style.display = 'flex';
                }, 10); // Petit délai pour activer la transition après l'affichage

                // Afficher la modale de connexion (modalLogin)
                setTimeout(() => {
                    modalLogin.classList.add('ModalLoginBase-show');
                    modalLogin.style.display = 'flex';
                }, 500); // Délai pour que la modale de connexion apparaisse après la fermeture de la modale d'inscription

                // event.preventDefault();
                // navigateTo('/login');
            }
        })
        .catch(error => {
            if (DEBUG) {console.error('Error while registering', error);}
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Error while registering, please try again';
            formRegister.insertBefore(errorMessage, submitRegisterButton);
            });
    });
    modalRegisterBody.appendChild(formRegister);

    modalRegisterContent.appendChild(formRegister);

    ButtonRegisterHome.addEventListener('mousedown', () => {
        // Affiche la modal
        modalRegister.style.display = 'block';
        setTimeout(() => {
            modalRegister.classList.add('modalRegisterBase-show'); // Ajoute la classe pour l'animation
        }, 10); // Légère temporisation pour l'effet d'animation

    });

}
