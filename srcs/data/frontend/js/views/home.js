import { DEBUG, navigateTo } from '../app.js';
import { changeLanguage, getCookie } from './utils.js';

export function homeView(container) {

    container.innerHTML = '';

    const base = document.createElement('div');
    base.className = 'base navbarr';
    container.appendChild(base);

    const HomeTitle = document.createElement('h5');
    HomeTitle.className = 'HomeTitle';
    HomeTitle.textContent = 'Pong site';
    base.appendChild(HomeTitle);

    const cardHome = document.createElement('div');
    cardHome.className = 'card-body cardHome';
    base.appendChild(cardHome);

    const ButtonLoginHome = document.createElement('button');
    ButtonLoginHome.className = 'btn btn-primary btn-lg ButtonsHome';
    ButtonLoginHome.textContent = "Login";
    cardHome.appendChild(ButtonLoginHome);

    const ButtonRegisterHome = document.createElement('button');
    ButtonRegisterHome.className = 'btn btn-primary btn-lg ButtonsHome';
    ButtonRegisterHome.textContent = "Register";
    cardHome.appendChild(ButtonRegisterHome);

    ///////////////////////////////////////////////////////////////

    // Modal-Login
    const modal = document.createElement('div');
    modal.className = 'modal ModalLoginBase';
    modal.style.display = 'none'; // Cachée par défaut
    container.appendChild(modal);

    // Créer le contenu de la modale
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content ModalLogin';
    modal.appendChild(modalContent);

    // Bouton pour fermer la modale
    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.textContent = '×'; // Symbole de fermeture
    modalContent.appendChild(closeButton);

    // Titre du formulaire
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Login';
    modalTitle.className = 'modalLoginTitle'
    modalContent.appendChild(modalTitle);

    // Créer le formulaire
    const formLogin = document.createElement('form');

    // Champs du formulaire
    const fields = [
      { label: 'Nom d\'utilisateur', type: 'username', id: 'username', placeholder: 'Entrez votre nom d\'utilisateur' },
      { label: 'Mot de passe', type: 'password', id: 'password', placeholder: 'Entrez votre mot de passe' },
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
    modalContent.appendChild(formLogin);

    // Bouton de soumission
    const submitLoginButton = document.createElement('button');
    submitLoginButton.type = 'submit';
    submitLoginButton.className = 'btn btn-primary w-100 ButtonLogin';
    submitLoginButton.textContent = 'Se connecter';
    formLogin.appendChild(submitLoginButton);

    formLogin.addEventListener('submit', (event) => {
        event.preventDefault();

        // Suppression des messages d'erreur précédents
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
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User logged in successfully') {
                localStorage.setItem('token', data.token);
                modal.classList.remove('ModalLoginBase-show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 500); // Même délai pour l'animation de fermeture
                // Ou redirection vers une autre page
            } else if (data.error) {
                if (DEBUG) {console.error('Erreur lors de la connexion', data.error);}
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Mauvais mot de passe ou nom d\'utilisateur, veuillez réessayer';
                formLogin.insertBefore(errorMessage, submitLoginButton);
            }
        })
        .catch(error => {
            if (DEBUG) {console.error('Erreur lors de la connexion', error);}
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
            formLogin.insertBefore(errorMessage, submitLoginButton);
        });
    });
    //////////////////////////////////////////////////////////

    //////MODAL REGISTER///////////////////
    // Modal-Register
    const modalRegister = document.createElement('div');
    modalRegister.className = 'modal ModalLoginBase';
    modalRegister.style.display = 'none'; // Cachée par défaut
    container.appendChild(modalRegister);

    // Créer le contenu de la modale
    const modalRegisterContent = document.createElement('div');
    modalRegisterContent.className = 'modal-content ModalLogin';
    modalRegister.appendChild(modalRegisterContent);

    // Bouton pour fermer la modale
    const closeRegisterButton = document.createElement('span');
    closeRegisterButton.className = 'close-button';
    closeRegisterButton.textContent = '×'; // Symbole de fermeture
    modalRegisterContent.appendChild(closeRegisterButton);

    // Titre du formulaire
    const modalRegisterTitle = document.createElement('h2');
    modalRegisterTitle.textContent = 'Register';
    modalRegisterTitle.className = 'modalLoginTitle'
    modalRegisterContent.appendChild(modalRegisterTitle);

    // Créer le formulaire
    const formRegister = document.createElement('form');

    // Champs du formulaire
    const fieldsRegister = [
        { label: 'Nom d\'utilisateur' , type: 'text', id: 'usernameRe', placeholder: 'Entrez votre nom d\'utilisateur' },
        { label: 'Pseudo', type: 'text', id: 'nicknameRe', placeholder: 'Entrez votre pseudo' },
        { label: 'Adresse email', type: 'email', id: 'emailRe', placeholder: 'Entrez votre email' },
        { label: 'Mot de passe', type: 'password', id: 'passwordRe', placeholder: 'Entrez un mot de passe' },
        { label: 'Confirmer le mot de passe', type: 'password', id: 'confirmpasswordRe', placeholder: 'Confirmez votre mot de passe' },
    ];

    fieldsRegister.forEach(fieldRegister => {
        const formGroup = document.createElement('div');
        formGroup.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label titleLabelRegister';
        label.htmlFor = fieldRegister.id;
        label.textContent = fieldRegister.label;

        const input = document.createElement('input');
        input.type = fieldRegister.type;
        input.className = 'form-control FormChamp';
        input.id = fieldRegister.id;
        input.placeholder = fieldRegister.placeholder;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        formRegister.appendChild(formGroup);
    });

    // Bouton de soumission
    const submitRegisterButton = document.createElement('button');
    submitRegisterButton.setAttribute('type', 'submit');
    submitRegisterButton.className = 'btn btn-primary w-100 ButtonRegister';
    submitRegisterButton.textContent = "S'inscrire";
    formRegister.appendChild(submitRegisterButton);

    formRegister.addEventListener('submit', (event) => {
        event.preventDefault();

        // Suppression des messages d'erreur précédents
        const errorMessages = form.querySelectorAll('.text-danger');
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
            errorMessage.textContent = 'Tous les champs sont obligatoires';
            formRegister.insertBefore(errorMessage, submitRegisterButton);
            return;
        }
        // Si les mots de passe ne correspondent pas
        else if (passwordRe !== confirmPasswordRe) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Les mots de passe ne correspondent pas';
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
                errorMessage.textContent = 'Erreur lors de l\'inscription, veuillez réessayer';
                formRegister.insertBefore(errorMessage, submitRegisterButton);
            }
            else {
                // Si l'inscription est réussie, on ferme la modale et on ouvre la modale de connexion
                modalRegister.classList.remove('ModalLoginBase-show');
                setTimeout(() => {
                    modalRegister.style.display = 'none';
                }, 500); // Même délai pour l'animation de fermeture
                modal.classList.add('ModalLoginBase-show');
                setTimeout(() => {
                    modal.style.display = 'flex';
                }, 10); // Petit délai pour activer la transition après l'affichage

                // event.preventDefault();
                // navigateTo('/login');
            }
        })
        .catch(error => {
            if (DEBUG) {console.error('Erreur lors de l\'inscription', error);}
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Erreur lors de l\'inscription, veuillez réessayer';
            formRegister.insertBefore(errorMessage, submitRegisterButton);
            });
    });

    modalRegisterContent.appendChild(formRegister);


    ///////////////////////////////////////////////////////////////////////

    // Événement pour afficher la modale LOGIN avec animation
    ButtonLoginHome.addEventListener('click', () => {
        modal.style.display = 'flex'; // Changer l'affichage à flex pour centrer
        setTimeout(() => {
            modal.classList.add('ModalLoginBase-show'); // Ajouter la classe d'animation
        }, 10); // Petit délai pour activer la transition après l'affichage
    });

    // Événement pour afficher la modale REGISTER avec animation
    ButtonRegisterHome.addEventListener('click', () => {
        modalRegister.style.display = 'flex'; // Changer l'affichage à flex pour centrer
        setTimeout(() => {
            modalRegister.classList.add('ModalLoginBase-show'); // Ajouter la classe d'animation
        }, 10); // Petit délai pour activer la transition après l'affichage
    });

    // Événement pour fermer la modale LOGIN avec animation
    closeButton.addEventListener('click', () => {
        modal.classList.remove('ModalLoginBase-show'); // Retirer la classe d'animation
        setTimeout(() => {
            modal.style.display = 'none'; // Cacher la modale après l'animation
        }, 500); // Délai correspondant à la durée de l'animation CSS
    });

    // Événement pour fermer la modale REGISTER avec animation
    closeRegisterButton.addEventListener('click', () => {
        modalRegister.classList.remove('ModalLoginBase-show'); // Retirer la classe d'animation
        setTimeout(() => {
            modalRegister.style.display = 'none'; // Cacher la modale après l'animation
        }, 500); // Délai correspondant à la durée de l'animation CSS
    });

    // Fermer la modale si on clique à l'extérieur du contenu
    window.addEventListener('click', (event) => {
        closeModal(event, modal)
    });

    // Fermer la modale si on clique à l'extérieur du contenu
    window.addEventListener('click', (event) => {
        closeModal(event, modalRegister)
    });
}

function closeModal(event, modal){
    if (event.target === modal) {
        modal.classList.remove('ModalLoginBase-show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500); // Même délai pour l'animation de fermeture
    }
}

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
