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

	const ContenerTournament = document.createElement('div');
	ContenerTournament.className = 'ContenerTournament w-100 h-100 d-flex justify-content-center align-items-center';
	mainDivMenu.appendChild(ContenerTournament);

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
		return button;
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

soloButton.addEventListener('click', () => {
    navigateTo('/pongSolo'); // Page du jeu solo
});

// Bouton Duo
const duoButton = createAnimatedButton(
    'DuoButton',               // Classe du bouton
    'Duo',                     // Texte du bouton
    '/js/img/pong1.png',      // PNG pour Duo
    '/js/img/pong.gif',       // GIF pour Duo
    'ContenerDuoButton w-50 h-100 d-flex justify-content-center align-items-end'
);
duoButton.addEventListener('click', () => {
    navigateTo('/pong'); // Page du jeu en duo
});

// Bouton Tournament
const tournamentButton = createAnimatedButtonTournament(
    'TournamentButton',        // Classe du bouton
    'Tournament',              // Texte du bouton
    '/js/img/pong1.png',      // PNG pour Tournament
    '/js/img/pong.gif',       // GIF pour Tournament
    'ContenerTournamentButton w-50 h-100 d-flex justify-content-center align-items-center'
);
tournamentButton.addEventListener('click', () => {
    navigateTo('/tournament');
});

    soloButton.addEventListener('click', () => {

        modalGameSettings.style.display = 'block'; // Affiche la modal
        setTimeout(() => {
            modalGameSettings.classList.add('modalGameSettingsBase-show'); // Ajoute la classe pour l'animation
            mainDivMenu.style.backdropFilter = 'blur(10px)'; // Ajoute le flou via JS
            mainDivMenu.style.transition = 'backdrop-filter 0.3s ease'; // Ajoute une transition fluide

        }, 10);
    });

///////////////////////////////////////////////////////////////
    // ModalGameSettings

    const modalGameSettings = document.createElement('div');
    modalGameSettings.className = 'modal modalGameSettingsBase ';
    modalGameSettings.setAttribute('tabindex', '-1');
    modalGameSettings.setAttribute('aria-labelledby', 'modalGameSettingsLabel');
    modalGameSettings.setAttribute('aria-hidden', 'true');
    modalGameSettings.style.display = 'none'; // Initialement caché
    mainDivMenu.appendChild(modalGameSettings);

    const modalGameSettingsDialog = document.createElement('div');
    modalGameSettingsDialog.className = 'modal-dialog-centered d-flex justify-content-center align-items-center modalLoginDialog';
    modalGameSettings.appendChild(modalGameSettingsDialog);

    const modalGameSettingsContent = document.createElement('div');
    modalGameSettingsContent.className = 'modal-content modalLoginContent';
    modalGameSettingsDialog.appendChild(modalGameSettingsContent);

    const modalGameSettingsHeader = document.createElement('div');
    modalGameSettingsHeader.className = 'modal-header pb-2 border-bottom modalLoginHeader';
    modalGameSettingsContent.appendChild(modalGameSettingsHeader);

    const modalGameSettingsTitle = document.createElement('h2');
    modalGameSettingsTitle.textContent = 'Game Settings';
    modalGameSettingsTitle.className = 'modal-title modalLoginTitle';
    modalGameSettingsHeader.appendChild(modalGameSettingsTitle);

    const closeButton = document.createElement('span');
    closeButton.id = 'closeButton';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.setAttribute('role', 'button'); // Make it focusable for accessibility
    closeButton.setAttribute('tabindex', '0'); // Make it focusable for accessibility
    closeButton.className = 'closeButtonMenuPong';
    closeButton.textContent = '×';
    modalGameSettingsHeader.appendChild(closeButton);

    // Add event listener for keyboard accessibility
    closeButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); // Disable the default action
            closeButton.click(); // Simulate a click on the button
        }
    });

    // Add event listener for mouse accessibility
    closeButton.addEventListener('click', () => {
        modalGameSettings.classList.remove('modalGameSettingsBase-show');
        setTimeout(() => {
            modalGameSettings.style.display = 'none';
            mainDivMenu.style.backdropFilter = 'none'; // Retire le flou via JS
        }, 100);
    });

    document.addEventListener('click', (event) => {
        // Si le clic est en dehors du contenu de la modal
        if (!modalGameSettingsContent.contains(event.target) && !soloButton.contains(event.target) && modalGameSettings.style.display === 'block') {
            modalGameSettings.classList.remove('modalGameSettingsBase-show');
            document.body.classList.remove('blur-background'); // Enlève l'effet de flou
            setTimeout(() => {
                modalGameSettings.style.display = 'none';
            }, 100);
        }
    });

    const modalGameSettingsBody = document.createElement('div');
    modalGameSettingsBody.className = 'modal-body mt-2';
    modalGameSettingsContent.appendChild(modalGameSettingsBody);

    const form = document.createElement('form');
    modalGameSettingsBody.appendChild(form);

    const TitleBackgroundColor = document.createElement('h5');
    TitleBackgroundColor.className = 'TitleBackgroundColor mb-4';
    TitleBackgroundColor.textContent = 'Game color';
    form.appendChild(TitleBackgroundColor);

    // Div contenant les options de couleur
    const colorOptionsContainer = document.createElement('div');
    colorOptionsContainer.className = 'd-flex justify-content-center mb-3 colorOptionsContainer';
    form.appendChild(colorOptionsContainer);

    // Tableau des couleurs disponibles
    const colors = ['#000000', '#fdfefe', '#7d3c98', '#FFC0CB', '#f4d03f', '#229954','#a6acaf', '#1a5276', '#d7bde2','#c0392b', '#873600', '#58d68d', '#85c1e9 '];

    // Fonction pour créer chaque div de couleur
    colors.forEach((color) => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-option';
        colorDiv.style.backgroundColor = color;
        colorDiv.style.width = '40px';
        colorDiv.style.height = '40px';
        colorDiv.style.borderRadius = '50%';
        colorDiv.style.margin = '0 5px';
        colorDiv.style.cursor = 'pointer';
        colorDiv.style.border = '2px solid transparent'; // Bordure initialement transparente

        // Ajout de l'événement de sélection de couleur
        colorDiv.addEventListener('click', () => {
            // Retirer la bordure des autres options
            document.querySelectorAll('.color-option').forEach(option => {
                option.style.border = '2px solid transparent';
            });
            if (color === '#000000') {
                colorDiv.style.border = '2px solid #fff'; // Bordure blanche si noir sélectionné
            } else {
                colorDiv.style.border = '2px solid #000'; // Bordure noire pour les autres couleurs
            }
        });

        colorOptionsContainer.appendChild(colorDiv);
    });

    const TitlePadsColor = document.createElement('h5');
    TitlePadsColor.className = 'TitlePadsColor mb-4';
    TitlePadsColor.textContent = 'Pads Color';
    form.appendChild(TitlePadsColor);

    const colorOptionsContainerPad = document.createElement('div');
    colorOptionsContainerPad.className = 'd-flex justify-content-center mb-3 colorOptionsContainer';
    form.appendChild(colorOptionsContainerPad);


    // Fonction pour créer chaque div de couleur
    colors.forEach((color) => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-option';
        colorDiv.style.backgroundColor = color;
        colorDiv.style.width = '40px';
        colorDiv.style.height = '40px';
        colorDiv.style.borderRadius = '50%';
        colorDiv.style.margin = '0 5px';
        colorDiv.style.cursor = 'pointer';
        colorDiv.style.border = '2px solid transparent'; // Bordure initialement transparente

        // Ajout de l'événement de sélection de couleur
        colorDiv.addEventListener('click', () => {
            // Retirer la bordure des autres options
            document.querySelectorAll('.color-option').forEach(option => {
                option.style.border = '2px solid transparent';
            });
            if (color === '#000000') {
                colorDiv.style.border = '2px solid #fff'; // Bordure blanche si noir sélectionné
            } else {
                colorDiv.style.border = '2px solid #000'; // Bordure noire pour les autres couleurs
            }
        });

        colorOptionsContainerPad.appendChild(colorDiv);
    });

    const TitleBallColor = document.createElement('h5');
    TitleBallColor.className = 'TitleBallColor mb-4';
    TitleBallColor.textContent = 'Ball Color';
    form.appendChild(TitleBallColor);

    const colorOptionsContainerBall = document.createElement('div');
    colorOptionsContainerBall.className = 'd-flex justify-content-center mb-3 colorOptionsContainer';
    form.appendChild(colorOptionsContainerBall);


    // Fonction pour créer chaque div de couleur
    colors.forEach((color) => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-option';
        colorDiv.style.backgroundColor = color;
        colorDiv.style.width = '40px';
        colorDiv.style.height = '40px';
        colorDiv.style.borderRadius = '50%';
        colorDiv.style.margin = '0 5px';
        colorDiv.style.cursor = 'pointer';
        colorDiv.style.border = '2px solid transparent'; // Bordure initialement transparente

        // Ajout de l'événement de sélection de couleur
        colorDiv.addEventListener('click', () => {
            // Retirer la bordure des autres options
            document.querySelectorAll('.color-option').forEach(option => {
                option.style.border = '2px solid transparent';
            });
            if (color === '#000000') {
                colorDiv.style.border = '2px solid #fff'; // Bordure blanche si noir sélectionné
            } else {
                colorDiv.style.border = '2px solid #000'; // Bordure noire pour les autres couleurs
            }
        });

        colorOptionsContainerBall.appendChild(colorDiv);
    });

    const playButton = document.createElement('button');
    playButton.type = 'submit';
    playButton.className = 'btn btn-primary w-100 Button mb-3';
    playButton.textContent = 'Play';
    form.appendChild(playButton);

    form.addEventListener('submit', (event) => {


        event.preventDefault();

        const errorMessages = form.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());
        const successMessages = settingsForm.querySelectorAll('.text-success');
        successMessages.forEach(message => message.remove());

        // CHAMPS SELECTION
        //== COLOR SELECTIONNER ET ENREGISTRER BACK
        //
        //SI PREMIERE FOIS && AUCUN DES CHAMPS N'A ETE SELECTION
        //== COLOR DEFAULT
        //
        //SI PAS PREMIERE FOIS && AUCUN DES CHAMPS N'A ETE SELECTION
        // == COLOR DEFAULT OU COLOR SELECTIONNER AVANT

        try {
            const response = fetch('/api/updateGameSettings/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({ background_game, pads_color, ball_color }),
            });

            if (response.ok) {

                const successMessage = document.createElement('p');
                successMessage.className = 'text-success';
                successMessage.textContent = 'Parameters successfully modified';
                form.appendChild(successMessage);
                modalGameSettings.classList.remove('modalGameSettingsBase-show');
                setTimeout(() => {
                    modalGameSettings.style.display = 'none';
                    mainDivMenu.style.backdropFilter = 'none'; // Retire le flou via JS
                }, 100);
                form.reset();
                navigateTo('/pong');
            }
            else {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Invalid coulour choices';
                form.insertBefore(errorMessage, playButton);
                form.reset();
            }
        } catch (error) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'An error has occurred. Please try again.';
            form.insertBefore(errorMessage, playButton);
            // Reset the form after success
            form.reset();
        }
    });



	const notifications_div = await notifications();
	div.appendChild(notifications_div);
}
