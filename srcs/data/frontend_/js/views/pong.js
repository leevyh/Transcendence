import {
    play,
    stop,
    reset,
    handleKeyDown,
    handleKeyUp,
    draw,
} from './pong_game.js'; // Importation des fonctions et variables du jeu Pong


import { GameOn } from './pong_game.js';
export let canvas = 'null'
// const canvas = document.getElementById('canvas');
// var game = {
// 	player: {
// 		score: 0
// 	},
// 	computer: {
// 		score: 0,
// 		speedRatio: 0.75
// 	},
// 	ball: {
// 		r: 5,
// 		speed: {}
// 	}
// };


export function pongView(container) {

	container.innerHTML = '';// Vider le contenu précédent
	loadPongCSS();  // CSS

    // HTML
    const main = document.createElement('main');
    main.setAttribute('role', 'main');

    const ul = document.createElement('ul');
    ul.className = 'd-flex justify-content-center';

    const startButtonLi = document.createElement('li');
    const startButton = document.createElement('button');
    startButton.className = 'btn btn-outline-success';
    startButton.id = 'start-game';
    startButton.textContent = 'Start';
    startButtonLi.appendChild(startButton);

    const stopButtonLi = document.createElement('li');
    const stopButton = document.createElement('button');
    stopButton.className = 'btn btn-outline-danger';
    stopButton.id = 'stop-game';
    stopButton.textContent = 'Stop';
    stopButtonLi.appendChild(stopButton);

    ul.appendChild(startButtonLi);
    ul.appendChild(stopButtonLi);

    const canvasElement = document.createElement('canvas');
    canvasElement.className = 'canvas';
    canvasElement.id = 'canvas';
    canvasElement.width = 640;
    canvasElement.height = 480;

    const scoreP = document.createElement('p');
    scoreP.className = 'd-flex justify-content-center';
    scoreP.innerHTML = 'Joueur 1 : <em id="player-score">0</em> - Joueur 2 : <em id="computer-score">0</em>';

    main.appendChild(ul);
    main.appendChild(canvasElement);
    main.appendChild(scoreP);

    container.appendChild(main);

    canvas = document.getElementById('canvas');

	reset(); // Init game
    draw();
    console.log("coucou");
    // Event

    document.addEventListener('keydown', (event) => handleKeyDown(event, startButton, stopButton));
    document.addEventListener('keyup', handleKeyUp);

    const startGameButton = document.querySelector('#start-game');
    const stopGameButton = document.querySelector('#stop-game');

    startGameButton.addEventListener('click', () => {
        if (!GameOn) {
            play();
            startGameButton.disabled = true; // Désactiver le bouton Start
            stopGameButton.disabled = false; // Activer le bouton Stop
        }
    });

    stopGameButton.addEventListener('click', () => {
        if (GameOn) {
            stop();
            startGameButton.disabled = false; // Réactiver le bouton Start
            stopGameButton.disabled = true; // Désactiver le bouton Stop
        }
    });

    stopGameButton.disabled = true; // Le bouton Stop est désactivé au début
}


// CSS Pong
function loadPongCSS() {
    const style = document.createElement('style');
    style.textContent = `

		body {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			margin: 0;
		}

		ul {
			margin: 0;
			padding: 0;
			list-style-type: none;
		}

		li {
			padding: 5px;
		}

		.canvas {
			max-width: 100%;
			height: auto;
            border-style: groove;
            border-color: black;
		}
    `;
    document.head.appendChild(style);
}

