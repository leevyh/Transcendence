import { navigateTo } from '../app.js';
import { navigationBar } from './navigation.js';
import { notifications } from './notifications.js';
import { getCookie } from './utils.js';

export async function menuPongView(container) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navBarContainer = await navigationBar(container);
    div.appendChild(navBarContainer);

	const mainDivMenu = document.createElement('div');
	mainDivMenu.className = 'd-flex flex-grow-1 m-4 d-flex flex-column';
	div.appendChild(mainDivMenu);

	const twoButtons = document.createElement('div');
	twoButtons.className = 'twoButtons h-50 w-100 d-flex justify-content-around align-items-center';
	mainDivMenu.appendChild(twoButtons);

	// const ContenerSoloButton = document.createElement('div');
	// ContenerSoloButton.className = 'ContenerSoloButton w-50 h-100 d-flex justify-content-center align-items-end';
	// twoButtons.appendChild(ContenerSoloButton);

	// // Création d'un bouton dans le DOM
	// const soloButton = document.createElement('button');
	// // soloButton.classList.add('btn-custom');
	// soloButton.className = 'soloButton btn p-4 w-75 bg-black';
	// ContenerSoloButton.appendChild(soloButton);

	// const soloButtonContent = document.createElement('p');
	// soloButtonContent.textContent = 'Solo';
	// soloButtonContent.className = 'soloButtonContent m-0 w-100 h-100 d-flex justify-content-center align-items-center';
	// soloButton.appendChild(soloButtonContent);

	// // Création de l'image statique
	// const staticImage = document.createElement('img');
	// staticImage.src = '/js/img/pong.png';
	// staticImage.classList.add('static-img');
	// soloButton.appendChild(staticImage);

	// // // Création de l'image GIF pour l'animation
	// const hoverGif = document.createElement('img');
	// hoverGif.src = '/js/img/pong.gif';
	// hoverGif.className = 'hoverGif';
	// hoverGif.classList.add('hover-gif');
	// hoverGif.playbackRate = 2;
	// soloButton.appendChild(hoverGif);

	// const ContenerDuoButton = document.createElement('div');
	// ContenerDuoButton.className = 'ContenerDuoButton w-50 h-100 d-flex justify-content-center align-items-end';
	// twoButtons.appendChild(ContenerDuoButton);

	// const DuoButton = document.createElement('div');
	// DuoButton.className = 'DuoButton btn p-4 w-75';
	// ContenerDuoButton.appendChild(DuoButton);

	// const DuoButtonContent = document.createElement('p');
	// DuoButtonContent.textContent = 'Duo';
	// DuoButtonContent.className = 'DuoButtonContent w-100  m-0 h-100 d-flex justify-content-center align-items-center';
	// DuoButton.appendChild(DuoButtonContent);


	// const staticImageDuo = document.createElement('img');
	// staticImageDuo.src = '/js/img/pong.png';  // Mettre l'image statique pour Duo
	// staticImageDuo.classList.add('static-img');
	// DuoButton.appendChild(staticImageDuo);

	// const hoverGifDuo = document.createElement('img');
	// hoverGifDuo.src = '/js/img/pong.gif';  // Mettre le GIF pour Duo
	// hoverGifDuo.className = 'hoverGif';
	// DuoButton.appendChild(hoverGifDuo);

	const ContenerTournament = document.createElement('div');
	ContenerTournament.className = 'ContenerTournament w-100 h-100 d-flex justify-content-center align-items-center';
	mainDivMenu.appendChild(ContenerTournament);


	// const ContenerTournamentButton = document.createElement('div');
	// ContenerTournamentButton.className = 'ContenerTournamentButton w-50 h-100 d-flex justify-content-center align-items-center';
	// ContenerTournament.appendChild(ContenerTournamentButton);

	// // Création d'un bouton dans le DOM
	// const TournamentButton = document.createElement('button');
	// // TournamentButton.classList.add('btn-custom');
	// TournamentButton.className = 'DuoButton btn p-4 w-75';
	// ContenerTournamentButton.appendChild(TournamentButton);

	// const TournamentButtonContent = document.createElement('p');
	// TournamentButtonContent.textContent = 'Tournament';
	// TournamentButtonContent.className = 'TournamentButtonContent m-0 w-100 h-100 d-flex justify-content-center align-items-center';
	// TournamentButton.appendChild(TournamentButtonContent);

	// Fonction pour créer un bouton avec animation
	function createAnimatedButton(buttonClassName, buttonText, pngSrc, gifSrc, container) {
		const buttonContainer = document.createElement('div');
		buttonContainer.className = container;
		twoButtons.appendChild(buttonContainer);

		const button = document.createElement('button');
		button.className = buttonClassName + ' btn p-4 w-75 bg-black';
		buttonContainer.appendChild(button);

		const buttonContent = document.createElement('p');
		buttonContent.textContent = buttonText;
		buttonContent.className = buttonClassName + 'Content m-0 w-100 h-100 d-flex justify-content-center align-items-center';
		button.appendChild(buttonContent);

		// Création de l'image statique (PNG)
		const staticImage = document.createElement('img');
		staticImage.src = pngSrc;
		staticImage.classList.add('static-img');
		button.appendChild(staticImage);

		// Création de l'image GIF pour l'animation
		const hoverGif = document.createElement('img');
		hoverGif.src = gifSrc;
		hoverGif.className = 'hoverGif';
		hoverGif.classList.add('hover-gif');
		button.appendChild(hoverGif);

		// Réinitialisation du GIF au survol
		button.addEventListener('mouseenter', () => {
			hoverGif.src = ''; // Vider le chemin de l'image temporairement
			hoverGif.src = gifSrc; // Remettre le même chemin pour redémarrer le GIF
		});

		// Retourner le bouton créé
		return button;
	}

	// Fonction pour créer un bouton Tournament (s'il y a des différences, on peut ajouter ici)
	function createAnimatedButtonTournament(buttonClassName, buttonText, pngSrc, gifSrc, container) {
		const buttonContainer = document.createElement('div');
		buttonContainer.className = container;
		ContenerTournament.appendChild(buttonContainer);

		const button = document.createElement('button');
		button.className = buttonClassName + ' btn p-4 w-75 bg-black';
		buttonContainer.appendChild(button);

		const buttonContent = document.createElement('p');
		buttonContent.textContent = buttonText;
		buttonContent.className = buttonClassName + 'Content m-0 w-100 h-100 d-flex justify-content-center align-items-center';
		button.appendChild(buttonContent);

		// Création de l'image statique (PNG)
		const staticImage = document.createElement('img');
		staticImage.src = pngSrc;
		staticImage.classList.add('static-img');
		button.appendChild(staticImage);

		// Création de l'image GIF pour l'animation
		const hoverGif = document.createElement('img');
		hoverGif.src = gifSrc;
		hoverGif.className = 'hoverGif';
		hoverGif.classList.add('hover-gif');
		button.appendChild(hoverGif);

		// Réinitialisation du GIF au survol
		button.addEventListener('mouseenter', () => {
			hoverGif.src = ''; // Vider le chemin de l'image temporairement
			hoverGif.src = gifSrc; // Remettre le même chemin pour redémarrer le GIF
		});
	}

	// Appeler la fonction pour créer les boutons avec leurs images respectives

	// Bouton Solo
	const soloButton = createAnimatedButton(
		'soloButton',               // Classe du bouton
		'Solo',                     // Texte du bouton
		'/js/img/pong1.png',       // PNG pour Solo
		'/js/img/pong.gif',        // GIF pour Solo
		'ContenerSoloButton w-50 h-100 d-flex justify-content-center align-items-end' // Classe du conteneur
	);

	// Ajouter un événement clic sur le bouton Solo
	soloButton.addEventListener('click', () => {
		navigateTo('/pong'); // Remplace cela par la fonction que tu veux appeler
	});

	// Bouton Duo
	createAnimatedButton(
		'DuoButton',               // Classe du bouton
		'Duo',                     // Texte du bouton
		'/js/img/pong1.png',      // PNG pour Duo
		'/js/img/pong.gif',       // GIF pour Duo
		'ContenerDuoButton w-50 h-100 d-flex justify-content-center align-items-end' // Classe du conteneur
	);

	// Bouton Tournament
	createAnimatedButtonTournament(
		'TournamentButton',        // Classe du bouton
		'Tournament',              // Texte du bouton
		'/js/img/pong1.png',      // PNG pour Tournament
		'/js/img/pong.gif',       // GIF pour Tournament
		'ContenerTournamentButton w-50 h-100 d-flex justify-content-center align-items-center' // Classe du conteneur
	);

///////////////////////////////////////////////////////////////
    // Modal
    // const modalGameSettings = document.createElement('div');
    // modalGameSettings.className = 'modal modalGameSettingsBase';
    // modalGameSettings.setAttribute('tabindex', '-1');
    // modalGameSettings.setAttribute('aria-labelledby', 'modalGameSettingsLabel');
    // modalGameSettings.setAttribute('aria-hidden', 'true');
    // modalGameSettings.style.display = 'none'; // Initialement caché
    // container.appendChild(modalGameSettings);

    // const modalGameSettingsDialog = document.createElement('div');
    // modalGameSettingsDialog.className = 'modal-dialog-centered d-flex justify-content-center align-items-center modalGameSettingsDialog';
    // modalGameSettings.appendChild(modalGameSettingsDialog);

    // const modalGameSettingsContent = document.createElement('div');
    // modalGameSettingsContent.className = 'modal-content modalGameSettingsContent';
    // modalGameSettingsDialog.appendChild(modalGameSettingsContent);

    // const modalGameSettingsHeader = document.createElement('div');
    // modalGameSettingsHeader.className = 'modal-header pb-2 border border-0 modalGameSettingsHeader';
    // modalGameSettingsContent.appendChild(modalGameSettingsHeader);

    // const modalGameSettingsTitle = document.createElement('h2');
    // modalGameSettingsTitle.textContent = 'Game Settings';
    // modalGameSettingsTitle.className = 'modal-title modalGameSettingsTitle';
    // modalGameSettingsHeader.appendChild(modalGameSettingsTitle);

    // const closeButton = document.createElement('span');
    // closeButton.id = 'closeButton';
    // closeButton.setAttribute('aria-label', 'Close');
    // closeButton.setAttribute('role', 'button'); // Make it focusable for accessibility
    // closeButton.setAttribute('tabindex', '0'); // Make it focusable for accessibility
    // closeButton.className = 'closeButton';
    // closeButton.textContent = '×';
    // modalGameSettingsHeader.appendChild(closeButton);

    // // Add event listener for keyboard accessibility
    // closeButton.addEventListener('keydown', function(event) {
    //     if (event.key === 'Enter' || event.key === ' ') {
    //         event.preventDefault(); // Disable the default action
    //         closeButton.click(); // Simulate a click on the button
    //     }
    // });

    // // Add event listener for mouse accessibility
    // closeButton.addEventListener('click', () => {
    //     modalGameSettings.classList.remove('modalGameSettingsBase-show');
    //     setTimeout(() => {
    //         modalGameSettings.style.display = 'none';
    //     }, 500);
    // });

    // const modalGameSettingsBody = document.createElement('div');
    // modalGameSettingsBody.className = 'modal-body';
    // modalGameSettingsContent.appendChild(modalGameSettingsBody);

    // const form = document.createElement('form');

    // const fields = [
    //     { label: "Username", type: 'text', id: 'username', placeholder: "Your Username" },
    //     { label: 'Password', type: 'password', id: 'password', placeholder: 'Your Password' },
    // ];

    // fields.forEach(field => {
    //     const formGroup = document.createElement('div');
    //     formGroup.className = 'mb-3';

    //     const label = document.createElement('label');
    //     label.className = 'form-label titleLabelRegister';
    //     label.htmlFor = field.id;
    //     label.textContent = field.label;

    //     const input = document.createElement('input');
    //     input.type = field.type;
    //     input.className = 'form-control FormChamp';
    //     input.id = field.id;
    //     input.placeholder = field.placeholder;

    //     formGroup.appendChild(label);
    //     formGroup.appendChild(input);
    //     form.appendChild(formGroup);
    // });
    // modalGameSettingsBody.appendChild(form);

    // const playButton = document.createElement('button');
    // playButton.type = 'submit';
    // playButton.className = 'btn btn-primary w-100 Button mb-3';
    // playButton.textContent = 'Play';
    // form.appendChild(playButton);

    // form.addEventListener('submit', (event) => {
    //     event.preventDefault();

    //     const errorMessages = form.querySelectorAll('.text-danger');
    //     errorMessages.forEach(message => message.remove());

    //     const username = document.getElementById('username').value;
    //     const password = document.getElementById('password').value;

    //     if (!username || !password) {
    //         const errorMessage = document.createElement('p');
    //         errorMessage.className = 'text-danger';
    //         errorMessage.textContent = 'All fields are required';
    //         form.insertBefore(errorMessage, playButton);
    //         return;
    //     }

    //     fetch('/apin/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': getCookie('csrftoken'),
    //         },
    //         body: JSON.stringify({ username, password }),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.message === 'User logged in successfully') {
    //                 localStorage.setItem('token', data.token);
    //                 window.dispatchEvent(new Event('userAuthenticated'));
    //                 modalGameSettings.classList.remove('modalGameSettingsBase-show');
    //                 setTimeout(() => {
    //                     modalGameSettings.style.display = 'none';
    //                 }, 500);
    //                 navigateTo('/profile');///////////
    //             } else if (data.error) {
    //                 const errorMessage = document.createElement('p');
    //                 errorMessage.className = 'text-danger';
    //                 errorMessage.textContent = 'Bad password or Username';
    //                 form.insertBefore(errorMessage, playButton);
    //             }
    //         })
    //         .catch(error => {
    //             const errorMessage = document.createElement('p');
    //             errorMessage.className = 'text-danger';
    //             errorMessage.textContent = 'An error has occurred. Please try again.';
    //             form.insertBefore(errorMessage, playButton);
    //         });
    // });

    // // // Ajout de l'événement pour afficher la modal
    // ButtonHome.addEventListener('mousedown', () => {
    //     modalGameSettings.style.display = 'block'; // Affiche la modal
    //     setTimeout(() => {
    //         modalGameSettings.classList.add('modalGameSettingsBase-show'); // Ajoute la classe pour l'animation
    //     }, 10); // Légère temporisation pour l'effet d'animation
    // });



	const notifications_div = await notifications();
	div.appendChild(notifications_div);
}
