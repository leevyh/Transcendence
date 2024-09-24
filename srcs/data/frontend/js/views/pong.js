import { navigationBar } from './navigation.js';
import { notifications } from './notifications.js';

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


export async function pongView(container) {
    container.innerHTML = '';
    // document.body.classList.add('page-with-nav'); // Ajout de la classe pour la navigation bar (padding)

    // Creation une grosse div pour le pong et la navigation bar
    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navBarContainer = await navigationBar(container);
    div.appendChild(navBarContainer);

	loadPongCSS();  // CSS

    // HTML
    const viewContainer = document.createElement('div');
    viewContainer.className = 'PongDiv';

    const ul = document.createElement('ul');
    ul.className = 'd-flex justify-content-center';


    const stopButtonLi = document.createElement('li');
    const stopButton = document.createElement('button');
    stopButton.className = 'btn btn-outline-danger';
    stopButton.id = 'stop-game';
    stopButton.textContent = 'Stop';
    stopButtonLi.appendChild(stopButton);

    ul.appendChild(stopButtonLi);

    const canvasElement = document.createElement('canvas');
    canvasElement.className = 'canvas';
    canvasElement.id = 'canvas';
    canvasElement.width = 640;
    canvasElement.height = 480;

    const scoreP = document.createElement('p');
    scoreP.className = 'd-flex justify-content-center';
    scoreP.innerHTML = 'Joueur 1 : <em id="player-score">0</em> - Joueur 2 : <em id="computer-score">0</em>';

    // const buttonGameSettingsContainer = document.createElement('div');
    // buttonGameSettingsContainer.className = "buttonGameSettingsContainer";

    // const buttonGameSettings = document.createElement('button');
    // buttonGameSettings.className = 'GameSettings btn p-4 w-75 bg-black';
    // buttonGameSettingsContainer.appendChild(buttonGameSettings);

    // const buttonGameSettingsContent = document.createElement('p');
    // buttonGameSettingsContent.textContent = 'settings';
    // buttonGameSettingsContent.className = 'buttonGameSettingsContent m-0 w-100 h-100 d-flex justify-content-center align-items-center';
    // buttonGameSettings.appendChild(buttonGameSettingsContent);

    viewContainer.appendChild(ul);
    viewContainer.appendChild(canvasElement);
    viewContainer.appendChild(scoreP);
    //viewContainer.appendChild(buttonGameSettingsContainer);

    div.appendChild(viewContainer);

    canvas = document.getElementById('canvas');

	reset(); // Init game
    draw();
    console.log("coucou");

    const socket = new WebSocket('ws://localhost:8888/ws/pong/');

    socket.onopen = () => {
        console.log("WebSocket connected");
    };
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.action_type === 'start_game') {
            startGame(stopButton);
        }
        // if (data.action_type === 'update_opponent_position') {
            //     if (data.player !== 'self') {
                //         game.computer.y = data.player_position;
                //     }
                //     updateOpponentPosition(data.player_position);
                //     game.ball.x = data.ball_position.x;
                //     game.ball.y = data.ball_position.y;
                // }
            };
            
            socket.onclose = () => {
                console.log("WebSocket disconnected");
            };
            
            document.addEventListener('keydown', (event) => handleKeyDown(event, stopButton));
            document.addEventListener('keyup', handleKeyUp);
            
            const stopGameButton = document.querySelector('#stop-game');
            
            // startGameButton.addEventListener('click', () => {
    //     if (!GameOn) {
    //         play();
    //         startGameButton.disabled = true; // Désactiver le bouton Start
    //         stopGameButton.disabled = false; // Activer le bouton Stop
    //     }
    // });

    stopGameButton.addEventListener('click', () => {
        if (GameOn) {
            stop();
            stopGameButton.disabled = true; // Désactiver le bouton Stop
        }
    });

    stopGameButton.disabled = true; // Le bouton Stop est désactivé au début

    const notifications_div = await notifications();
    div.appendChild(notifications_div);
}

// Fonction pour démarrer le décompte
function startCountdown() {
    console.log("startCountdown");
    let countdownValue = 3; // Décompte de 3 secondes

    // Créer dynamiquement un élément pour afficher le décompte
    let countdownElement = document.createElement('div');
    countdownElement.id = 'countdown';
    countdownElement.style.position = 'absolute';
    countdownElement.style.top = '50%';
    countdownElement.style.left = '50%';
    countdownElement.style.transform = 'translate(-50%, -50%)';
    countdownElement.style.fontSize = '48px';
    countdownElement.style.color = 'white';
    countdownElement.style.textAlign = 'center';
    countdownElement.style.zIndex = '1000';
    countdownElement.innerText = countdownValue;

    // Ajouter l'élément à la page
    document.body.appendChild(countdownElement);

    // Commencer le décompte
    let countdownInterval = setInterval(() => {
        countdownValue--; // Décrémente la valeur du décompte
        countdownElement.innerText = countdownValue;

        if (countdownValue <= 0) {
            clearInterval(countdownInterval); // Arrête le décompte quand il atteint 0
            countdownElement.innerText = "Go!"; // Affiche "Go!" avant de lancer le jeu

            // Supprimer le décompte après un court délai
            setTimeout(() => {
                countdownElement.remove();
                // Lancer le jeu après le décompte
                play(); // Appelle la fonction `play` pour démarrer le jeu
            }, 1000); // Affiche "Go!" pendant 1 seconde avant de l'enlever
        }
    }, 1000); // Intervalle de 1 seconde
}

// Fonction pour démarrer le jeu lorsque le serveur jumelle deux joueurs
function startGame(stopButton)
{
    if (!GameOn) {
        console.log("GameOn");
    startCountdown(); // Démarrer le décompte avant de lancer le jeu
    stopButton.disabled = false; // Activer le bouton Stop
    }
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

