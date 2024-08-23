import {
    play,
    stop,
    reset,
    handleKeyDown,
    handleKeyUp
} from './pong_game.js'; // Importation des fonctions et variables du jeu Pong

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
    // Event
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    document.querySelector('#start-game').addEventListener('click', play);
    document.querySelector('#stop-game').addEventListener('click', stop);

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
		}
    `;
    document.head.appendChild(style);
}

