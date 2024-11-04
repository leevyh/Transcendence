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
    initialize_color_duo,
} from './pong_game.js'; // Importation des fonctions et variables du jeu Pong


import { GameOn } from './pong_game.js';
export let canvas = 'null'
export let inTournament = false;
export let inGame = false;

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


    const canvasElement = document.createElement('canvas');
    canvasElement.className = 'canvas';
    canvasElement.id = 'canvas';
    canvasElement.width = 640;
    canvasElement.height = 480;

    const scoreP = document.createElement('p');
    scoreP.className = 'd-flex justify-content-center';

    scoreP.innerHTML = `
    <span style="font-size: 24px; font-weight: bold; margin-right: 40px;" id="player1-name"></span> 
    <span style="font-size: 24px; margin-right: 60px;" id="player1-score">0</span> - 
    <span style="font-size: 24px; margin-left: 60px;" id="player2-score">0</span> 
    <span style="font-size: 24px; font-weight: bold; margin-left: 40px;" id="player2-name"></span>
`;

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
    await initialize_color_duo();///
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

    setInGame(true);

    PongWebSocketManager.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.action_type === 'define_player') {
            var currentPlayer = data.current_player;
            var player_name = data.name_player;
            var game_name = data.game;
            console.log("data = ", data);
            if (currentPlayer === 'player_1') {
                document.addEventListener('keydown', (event) => handleKeyDown(event, 'player_1', player_name, game_name));
                document.addEventListener('keyup', (event) => handleKeyUp(event, 'player_1', player_name, game_name));
            } else if (currentPlayer === 'player_2') {
                document.addEventListener('keydown', (event) => handleKeyDown(event, 'player_2', player_name, game_name));
                document.addEventListener('keyup', (event) => handleKeyUp(event, 'player_2', player_name, game_name));
            }
        }
        if (data.action_type === 'start_game') {
            updatePlayerName(data.game.player1_name, data.game.player2_name);
            startGame(container, data.game.game_name);
        }
        if (data.action_type === 'waiting_for_player') {
            console.log("waiting for player");
            updatePlayerPositions(data.game.player_1_position, data.game.player_2_position);
            updateBallPosition(data.game.ball_position);
            // displayWaiting(container);
            draw();
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
        setInGame(false);
        console.log("Pong WebSocket disconnected", event);
    };
    const notifications_div = await notifications();
    div.appendChild(notifications_div);
}

// Fonction pour démarrer le décompte
function startCountdown(container, game_name) {
    
    // clearInterval(checkInGame);
    // waitingElement.remove();
    
    let countdownValue = 3;

    const gameContainer = container.querySelector('.PongDiv');
    if (!gameContainer) {
        console.error("Conteneur de jeu introuvable");
        return;
    }

    const canvas = document.getElementById('canvas');

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

    document.body.appendChild(gameNameElement);

    let index = 0;
    function typeGameName() {
        if (index < game_name.length) {
            gameNameElement.innerText += game_name.charAt(index);
            index++;
            setTimeout(typeGameName, 150);
        } else {

            document.body.appendChild(countdownElement);
            startCountdownTimer();
        }
    }
    typeGameName();
        
    function startCountdownTimer() {
        countdownElement.innerText = countdownValue;
        let countdownInterval = setInterval(() => {
            if (getInGame() === false) {
                console.log("countdown 1 inGame = ", inGame);
                clearInterval(countdownInterval); 
                countdownElement.remove();
                gameNameElement.remove();
                return;
            }
            countdownValue--;
            countdownElement.innerText = countdownValue;

            if (countdownValue <= 0) {
                clearInterval(countdownInterval);
                countdownElement.innerText = "Go!";

                setTimeout(() => {
                    countdownElement.remove();
                    gameNameElement.remove();
                    if (getInGame() === true) {
                        console.log("countdown 2 inGame = ", inGame);
                        play();
                        PongWebSocketManager.sendGameStarted();
                    }
                }, 1000);
            }
        }, 1000);
        const checkInGame = setInterval(() => {
            if (getInGame() === false) {
                console.log("countdown 3 inGame = ", inGame);
                clearInterval(countdownInterval);
                clearInterval(checkInGame);
                countdownElement.remove();
                gameNameElement.remove();
            }
        }, 10);
    }
}

// Fonction pour démarrer le jeu lorsque le serveur jumelle deux joueurs
function startGame(container, game_name)
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
}

function updateState(data) {
    updatePlayerPositions(data.game.player_1_position, data.game.player_2_position);
    updateBallPosition(data.game.ball_position);
    updateScores(data.game.player_1_score, data.game.player_2_score);
    draw();
}

async function update_Stats(data) {
    console.log("data = ", data);
    // data = {action_type: 'end_of_game', winner: 'rouge', result: 'win', nb_point_taken: 2, nb_point_given: 1}
    const response = await fetch('/api/updateStats/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            winner: data.winner,
            result: data.result,
            nb_point_taken: data.nb_point_taken,
            nb_point_given: data.nb_point_given,
        }),
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

    const displayDuration = 3000;
    const disappearDelay = 1000;

    const checkInGame = setInterval(() => {
        if (getInGame() === false) {
            console.log("displayWinner: inGame = ", inGame);
            clearInterval(checkInGame);
            winnerElement.style.opacity = '0';
            setTimeout(() => {
                winnerElement.remove();
            }, disappearDelay);
        }
    }, 100);

    setTimeout(() => {
        if (getInGame() === true) {
            winnerElement.style.opacity = '0';
            setTimeout(() => {
                winnerElement.remove();
            }, disappearDelay);
        }
    }, displayDuration);
}

//ecris "waiting another player..." jusqu'a ce que le deuxieme joueur se connecte
function displayWaiting(container) {
    const canvas = document.getElementById('canvas');
    const waitingElement = document.createElement('div');
    waitingElement.id = 'waiting-display';

    loadPongCSS();

    waitingElement.style.position = 'absolute';
    waitingElement.style.top = `${canvas.offsetTop + canvas.height / 2}px`;
    waitingElement.style.left = `${canvas.offsetLeft + canvas.width / 2}px`;
    waitingElement.style.transform = 'translate(-50%, -50%)';

    waitingElement.style.fontSize = '24px';
    waitingElement.style.color = 'white';
    waitingElement.style.textAlign = 'center';
    waitingElement.style.zIndex = '1000';
    waitingElement.innerText = 'Waiting for another player...';

    canvas.parentElement.appendChild(waitingElement);

    const checkInGame = setInterval(() => {
        if (getInGame() === false) {
            console.log("displayWaiting: inGame = ", inGame);
            clearInterval(checkInGame);
            waitingElement.remove();
        }
    }, 100);
}

export function disconnectPlayer() {
    PongWebSocketManager.sendDisconnect();
    setInGame(false);
}

export function getInGame() {
    return inGame;
}

export function setInGame(value) {
    inGame = value;
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

