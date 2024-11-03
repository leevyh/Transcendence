import { navigationBar } from './navigation.js';
import { navigateTo } from '../app.js';
import { PongWebSocketManager } from './wsPongManager.js';
import { notifications } from './notifications.js';
import { currentPlayer, endOfTournamentView } from './tournament.js';
import { getCookie } from './utils.js';


import {
    play,
    stop,
    endOfGame,
    // reset,
    handleKeyDown,
    handleKeyUp,
    draw,
    game,
} from './pong_game.js'; // Importation des fonctions et variables du jeu Pong


import { GameOn } from './pong_game.js';
export let canvas = 'null'
export let inTournament = false;

export async function pongView(container, tournamentSocket) {
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
    scoreP.innerHTML = '<em id="player1-name"></em> : <em id="player1-score">0</em> - <em id="player2-score">0</em> : <em id="player2-name"></em>';

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

    draw();

    // WebSocket
    if (tournamentSocket == null) {
        const wsUrl = 'ws://' + window.location.host + `/ws/pong/`;
        PongWebSocketManager.init(wsUrl);
    } 
    else {
        PongWebSocketManager.socket = tournamentSocket;
        console.log("PongWebSocketManager.socket");
        inTournament = true;
    }

    PongWebSocketManager.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        
        if (data.action_type === 'define_player') {
            var currentPlayer = data.current_player;
            var player_name = data.name_player;
            var game_name = data.game;
            console.log("data = ", data);
            console.log("currentPlayer = ", currentPlayer);
            if (currentPlayer === 'player_1') {
                document.addEventListener('keydown', (event) => handleKeyDown(event, stopButton, 'player_1', player_name, game_name));
                document.addEventListener('keyup', (event) => handleKeyUp(event, 'player_1', player_name, game_name));
            } else if (currentPlayer === 'player_2') {
                document.addEventListener('keydown', (event) => handleKeyDown(event, stopButton, 'player_2', player_name, game_name));
                document.addEventListener('keyup', (event) => handleKeyUp(event, 'player_2', player_name, game_name));
            }
        }
        if (data.action_type === 'start_game') {
            updatePlayerName(data.game.player1_name, data.game.player2_name);
            startGame(container, stopButton, data.game.game_name);
        }
        // if(data.action_type === 'show_game') {
        //     console.log("show game");
        //     pongView(container, PongWebSocketManager.socket);
        // }
        if (GameOn) {
            if (data.action_type === 'game_state')
                updateState(data);
        }
        if (data.action_type === 'end_of_game') {
            endOfGame(data);
            displayeWinner(data.winner);
            update_Stats(data);
            //wait 3 seconds before going back to the menu
            stopButton.disabled = true;
            if (inTournament == false) {
                setTimeout(() => {
                    navigateTo('/menuPong');
                }, 3000);
            }
        }
        if (data.action_type === 'final_results') {
            endOfGame(data);
            endOfTournamentView(container, data.ranking);
        }
        if (data.action_type === 'end_of_tournament') {
            navigateTo('/menuPong');
        }
    };

    PongWebSocketManager.socket.onclose = (event) => {
        console.log("Pong WebSocket disconnected", event);
    };
    const stopGameButton = document.querySelector('#stop-game');

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
function startCountdown(container, game_name) {
    let countdownValue = 3;

    const gameContainer = container.querySelector('.PongDiv');
    if (!gameContainer) {
        console.error("Conteneur de jeu introuvable");
        return;
    }

    const canvas = document.getElementById('canvas'); // Assurez-vous que l'ID correspond bien à celui de votre canvas

    let countdownElement = document.createElement('div');
    countdownElement.id = 'countdown';
    countdownElement.style.position = 'absolute';
    countdownElement.style.top = `${canvas.offsetTop + canvas.height / 2}px`;
    countdownElement.style.left = `${canvas.offsetLeft + canvas.width / 2}px`;
    countdownElement.style.transform = 'translate(-50%, -50%)';
    countdownElement.style.fontSize = '48px';
    countdownElement.style.color = 'white';
    countdownElement.style.textAlign = 'center';
    countdownElement.style.zIndex = '1000';
    // countdownElement.innerText = countdownValue;

    let gameNameElement = document.createElement('div');
    gameNameElement.id = 'game-name';
    gameNameElement.style.position = 'absolute';
    gameNameElement.style.top = `${canvas.offsetTop + canvas.height / 2 - 50}px`;
    gameNameElement.style.left = `${canvas.offsetLeft + canvas.width / 2}px`;
    gameNameElement.style.transform = 'translate(-50%, -50%)';
    gameNameElement.style.fontSize = '32px';
    gameNameElement.style.color = 'white';
    gameNameElement.style.textAlign = 'center';
    gameNameElement.style.zIndex = '1000';
    // gameNameElement.innerText = `${game_name}`;

    // document.body.appendChild(countdownElement);
    document.body.appendChild(gameNameElement);

    let index = 0;
    function typeGameName() {
        if (index < game_name.length) {
            gameNameElement.innerText += game_name.charAt(index);
            index++;
            setTimeout(typeGameName, 150); // Délai entre chaque lettre
        } else {

            document.body.appendChild(countdownElement);
            startCountdownTimer();
        }
    }
    typeGameName();
    window.addEventListener('beforeunload', () => {
        countdownElement.remove();
        gameNameElement.remove();
    });
        
    function startCountdownTimer() {
        countdownElement.innerText = countdownValue;
        let countdownInterval = setInterval(() => {
            countdownValue--;
            countdownElement.innerText = countdownValue;

            if (countdownValue <= 0) {
                clearInterval(countdownInterval);
                countdownElement.innerText = "Go!";

                setTimeout(() => {
                    countdownElement.remove();
                    gameNameElement.remove();
                    play();
                    PongWebSocketManager.sendGameStarted();
                }, 1000);
            }
        }, 1000);
    }
}

// Fonction pour démarrer le jeu lorsque le serveur jumelle deux joueurs
function startGame(container, stopButton, game_name)
{
    if (game_name === undefined) {
        game_name = 'Pong';
    }
    else if (game_name === 'semi_finals1' || game_name === 'semi_finals2') {
        game_name = 'Semi Final';
    }
    else if (game_name === 'finals') {
        game_name = 'Final';
    }
    else if (game_name === 'small_final') {
        game_name = 'Small Final';
    }
    startCountdown(container, game_name);
    stopButton.disabled = false;
}

function updateState(data) {
    updatePlayerPositions(data.game.player_1_position, data.game.player_2_position);
    updateBallPosition(data.game.ball_position);
    updateScores(data.game.player_1_score, data.game.player_2_score);
    draw();
}

async function update_Stats(data) {
    const response = await fetch('/api/update_Stats/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({data: data}),
    });
}

function updatePlayerPositions(player1Y, player2Y) {
    game.player1.y = player1Y;
    game.player2.y = player2Y;
}

function updateBallPosition(ballPosition) {
    game.ball.x = ballPosition.x;
    game.ball.y = ballPosition.y;
}

function updateScores(player_1_score, player_2_score) {
    document.querySelector('#player1-score').textContent = player_1_score;
    document.querySelector('#player2-score').textContent = player_2_score;
}

function updatePlayerName(player1_name, player2_name) {
    document.querySelector(`#player1-name`).textContent = player1_name;
    document.querySelector(`#player2-name`).textContent = player2_name;
}

function displayeWinner(winner) {
    const canvas = document.getElementById('canvas');
    const winnerElement = document.createElement('div');
    winnerElement.id = 'winner-display';

    loadPongCSS();

    // Positionnement relatif au canvas
    winnerElement.style.position = 'absolute';
    winnerElement.style.top = `${canvas.offsetTop + canvas.height / 2}px`;
    winnerElement.style.left = `${canvas.offsetLeft + canvas.width / 2}px`;
    winnerElement.style.transform = 'translate(-50%, -50%)';

    winnerElement.style.fontSize = '32px';
    winnerElement.style.color = 'white';
    winnerElement.style.textAlign = 'center';
    winnerElement.style.zIndex = '1000';
    winnerElement.innerText = `Winner ${winner}`;

    winnerElement.style.opacity = '0';
    winnerElement.style.transition = 'opacity 1s ease-in-out';

    canvas.parentElement.appendChild(winnerElement);

    setTimeout(() => {
        winnerElement.style.opacity = '1';
    }, 10); 

    setTimeout(() => {
        winnerElement.style.opacity = '0';  // Animation de disparition
        setTimeout(() => {
            winnerElement.remove();
        }, 1000);  // Temps pour la transition de disparition
    }, 3000);  // Laisser l'affichage pendant 3 secondes
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

