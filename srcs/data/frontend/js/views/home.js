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
    modalLoginDialog.className = 'modal-dialog modalLoginDialog';
    modalLogin.appendChild(modalLoginDialog);

    const modalLoginContent = document.createElement('div');
    modalLoginContent.className = 'modal-content modalLoginContent';
    modalLoginDialog.appendChild(modalLoginContent);

    const modalLoginHeader = document.createElement('div');
    modalLoginHeader.className = 'modal-header border-bottom border-custom-color pb-2 modalLoginHeader';
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
        { label: "Username", type: 'text', id: 'username', placeholder: "Username" },
        { label: 'Password', type: 'password', id: 'password', placeholder: 'Entrez votre mot de passe' },
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
    submitLoginButton.className = 'btn btn-primary w-100 ButtonLogin';
    submitLoginButton.textContent = 'Se connecter';
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
            errorMessage.textContent = 'Tous les champs sont obligatoires';
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
                    modalLogin.classList.remove('ModalLoginBase-show');
                    setTimeout(() => {
                        modalLogin.style.display = 'none';
                    }, 500);
                    navigateTo('/pong');
                } else if (data.error) {
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'text-danger';
                    errorMessage.textContent = 'Mauvais mot de passe ou nom d\'utilisateur';
                    formLogin.insertBefore(errorMessage, submitLoginButton);
                }
            })
            .catch(error => {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
                formLogin.insertBefore(errorMessage, submitLoginButton);
            });
    });

    // Connection avec 42
    const buttonLogin42 = document.createElement('button');
    buttonLogin42.className = 'btn btn-dark w-100 ButtonLogin42';
    buttonLogin42.textContent = 'Se connecter avec 42';
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
                errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
                formLogin.appendChild(errorMessage);
            });
    });

    /////////////////////////////////////////////////////////////////
    // Modal-Register (similaire à modalLogin, à adapter)
    /////////////////////////////////////////////////////////////////

    // Ajout de l'événement pour afficher la modal
    ButtonLoginHome.addEventListener('click', () => {
        modalLogin.style.display = 'block'; // Affiche la modal
        setTimeout(() => {
            modalLogin.classList.add('ModalLoginBase-show'); // Ajoute la classe pour l'animation
        }, 10); // Légère temporisation pour l'effet d'animation
    });

    // Gestion de la fermeture avec un clic en dehors de la modal
    window.addEventListener('click', (event) => {
        if (event.target === modalLogin) {
            modalLogin.classList.remove('ModalLoginBase-show');
            setTimeout(() => {
                modalLogin.style.display = 'none';
            }, 500);
        }
    });

}
// Connection with 42
    // const buttonLogin42 = document.createElement('button');
    // buttonLogin42.className = 'btn btn-dark w-100 ButtonLogin42';
    // buttonLogin42.textContent = 'Se connecter avec 42';
    // formLogin.appendChild(buttonLogin42);

    // buttonLogin42.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     fetch('/api/auth/', {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.url) {
    //                 window.location.href = data.url;
    //             }
    //         })
    //         .catch(error => {
    //             const errorMessage = document.createElement('p');
    //             errorMessage.className = 'text-danger';
    //             errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
    //             formLogin.appendChild(errorMessage);
    //         });




// function closeModal(event, modal) {
//     if (event.target === modal) {
//         modal.classList.remove('ModalLoginBase-show');
//         setTimeout(() => {
//             modal.style.display = 'none';
//         }, 500);
//     }
// }


// export function homeView(container) {
//     container.innerHTML = '';

//     // Creation d'un div base
//     const base = document.createElement('div');
//     base.className = 'base';
//     container.appendChild(base);

//     const h5 = document.createElement('h5');
//     h5.className = 'titleWelcome';
//     h5.setAttribute('data-i18n', 'home');
//     h5.textContent = 'Welcome';
//     base.appendChild(h5);

//     const divContener = document.createElement('div');
//     divContener.className = 'contener';
//     base.appendChild(divContener);

//     const divCardBody = document.createElement('div');
//     divCardBody.className = 'card-body twodivWelcome welcome';
//     divContener.appendChild(divCardBody);

//     const p = document.createElement('p');
//     p.className = 'paragraphWelcome';
//     p.setAttribute('data-i18n', 'homeText');
//     p.textContent = 'This is our transcendence homepage. This project involves creating a website for the mighty Pong competition! We hope you enjoy your visit to our site.';
//     divCardBody.appendChild(p);

//     // Creation d'une liste de boutons
//     const ul = document.createElement('ul');
//     ul.className = 'listButton';
//     divCardBody.appendChild(ul);

//     const liLogin = document.createElement('li');
//     liLogin.className = 'listElemWelcome';
//     ul.appendChild(liLogin);

//     const buttonLogin = document.createElement('button');
//     buttonLogin.className = 'btn btn-primary Buttonselem';
//     buttonLogin.setAttribute('data-i18n', 'login');
//     buttonLogin.textContent = 'Login'; // Ou 'Sign in'
//     buttonLogin.addEventListener('click', (event) => {
//         event.preventDefault();
//         navigateTo('/' + choiceLanguage + '/login');
//     });
//     liLogin.appendChild(buttonLogin);

//     const liRegister = document.createElement('li');
//     liRegister.className = 'listElemWelcome';
//     ul.appendChild(liRegister);

//     const buttonRegister = document.createElement('button');
//     buttonRegister.className = 'btn btn-primary Buttonselem';
//     buttonRegister.setAttribute('data-i18n', 'register');
//     buttonRegister.textContent = 'Register'; // Ou 'Sign up'
//     buttonRegister.addEventListener('click', (event) => {
//         event.preventDefault();
//         navigateTo('/' + choiceLanguage + '/register');
//     });
//     liRegister.appendChild(buttonRegister);

//     // Image de pong
//     const img = document.createElement('img');
//     img.setAttribute('src', '/assets/pong.png');
//     img.setAttribute('alt', 'Pong');

//     img.className = 'object-fit-fill border rounded twodivWelcome imgLogin';
//     divContener.appendChild(img);

//     // SELECTEUR DE LANGUE
//     const languageDiv = document.createElement('div');
//     languageDiv.id = 'language';

//     const languageLabel = document.createElement('label');
//     languageLabel.htmlFor = 'language-selector';
//     languageLabel.setAttribute('data-i18n', 'language_selector');
//     languageLabel.textContent = 'Language: ';
//     languageLabel.className = 'languageLabel';
//     languageDiv.appendChild(languageLabel);

//     const languageSelector = document.createElement('select');
//     languageSelector.id = 'language-selector';

//     const optionEn = document.createElement('option');
//     optionEn.value = 'en';
//     optionEn.innerHTML = '🇬🇧';

//     const optionFr = document.createElement('option');
//     optionFr.value = 'fr';
//     optionFr.innerHTML = '🇫🇷';

//     const optionEs = document.createElement('option');
//     optionEs.value = 'sp';
//     optionEs.innerHTML = '🇪🇸';

//     languageSelector.appendChild(optionEn);
//     languageSelector.appendChild(optionFr);
//     languageSelector.appendChild(optionEs);
//     languageDiv.appendChild(languageSelector);
//     base.appendChild(languageDiv);

//     let choiceLanguage = 'en';
//     document.querySelector("#language-selector").addEventListener("change", function() {
//         choiceLanguage = this.value;
//         changeLanguage(choiceLanguage);
//     });
// }
