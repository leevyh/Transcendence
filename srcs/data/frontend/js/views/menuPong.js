import { navigationBar } from './navigation.js';
import { notifications } from './notifications.js';
import { getCookie } from './utils.js';

export async function menuPongView(container) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navBarContainer = navigationBar(container);
    div.appendChild(navBarContainer);

	const mainDivMenu = document.createElement('div');
	mainDivMenu.className = 'd-flex flex-grow-1 m-4 d-flex flex-column';
	div.appendChild(mainDivMenu);

	const twoButtons = document.createElement('div');
	twoButtons.className = 'twoButtons h-50 w-100 d-flex justify-content-around align-items-center';
	mainDivMenu.appendChild(twoButtons);

	const ContenerSoloButton = document.createElement('div');
	ContenerSoloButton.className = 'ContenerSoloButton w-50 h-100 d-flex justify-content-center align-items-end';
	twoButtons.appendChild(ContenerSoloButton);

	// Création d'un bouton dans le DOM
	const soloButton = document.createElement('button');
	// soloButton.classList.add('btn-custom');
	soloButton.className = 'soloButton btn btn-primary p-5 w-75';
	ContenerSoloButton.appendChild(soloButton);

	const soloButtonContent = document.createElement('p');
	soloButtonContent.textContent = 'Solo';
	soloButtonContent.className = 'soloButtonContent w-100 h-100 d-flex justify-content-center align-items-center';
	soloButton.appendChild(soloButtonContent);

	// // Création de l'image statique
	// const staticImage = document.createElement('img');
	// staticImage.src = '/js/img/pong.png';
	// staticImage.classList.add('static-img');
	// soloButton.appendChild(staticImage);

	// // Création de l'image GIF pour l'animation
	// let hoverGif = document.createElement('img');
	// hoverGif.src = '/js/img/pong.gif';
	// hoverGif.className = 'hoverGif';
	// hoverGif.classList.add('hover-gif');
	// soloButton.appendChild(hoverGif);

	const ContenerDuoButton = document.createElement('div');
	ContenerDuoButton.className = 'ContenerDuoButton w-50 h-100 d-flex justify-content-center align-items-end';
	twoButtons.appendChild(ContenerDuoButton);

	const DuoButton = document.createElement('div');
	DuoButton.className = 'DuoButton btn btn-primary p-5 w-75';
	ContenerDuoButton.appendChild(DuoButton);

	const DuoButtonContent = document.createElement('p');
	DuoButtonContent.textContent = 'Duo';
	DuoButtonContent.className = 'DuoButtonContent w-100 h-100 d-flex justify-content-center align-items-center';
	DuoButton.appendChild(DuoButtonContent);


	const ContenerTournament = document.createElement('div');
	ContenerTournament.className = 'ContenerTournament w-100 h-100 d-flex justify-content-center align-items-center';
	mainDivMenu.appendChild(ContenerTournament);


	const ContenerTournamentButton = document.createElement('div');
	ContenerTournamentButton.className = 'ContenerTournamentButton w-50 h-100 d-flex justify-content-center align-items-center';
	ContenerTournament.appendChild(ContenerTournamentButton);

	// Création d'un bouton dans le DOM
	const TournamentButton = document.createElement('button');
	// TournamentButton.classList.add('btn-custom');
	TournamentButton.className = 'DuoButton btn btn-primary p-5 w-75';
	ContenerTournamentButton.appendChild(TournamentButton);

	const TournamentButtonContent = document.createElement('p');
	TournamentButtonContent.textContent = 'Tournament';
	TournamentButtonContent.className = 'TournamentButtonContent  w-100 h-100 d-flex justify-content-center align-items-center';
	TournamentButton.appendChild(TournamentButtonContent);

	const notifications_div = await notifications();
	div.appendChild(notifications_div);
}
