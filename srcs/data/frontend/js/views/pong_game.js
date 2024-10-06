export { canvas } from './pong.js'; // space game
// export var game; // statut game
import { PongWebSocketManager } from './wsPongManager.js';
export var anim;

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const MAX_SPEED = 10;
const PLAYER_SPEED = 9;

export var game = {
    player1: {
        x: PLAYER_WIDTH,
        y: PLAYER_HEIGHT,
        dy: PLAYER_SPEED
    },
    player2: {
        x: 640 - PLAYER_WIDTH,
        y: PLAYER_HEIGHT,
        dy: PLAYER_SPEED
    },
    ball: {
        r : 5,
        x: 640 / 2,
        y: 480 / 2,
        radius: 10
    }
};

var escapeDown = false;
export let GameOn = false;
var spaceDown = false;

export function draw() {
    var context = canvas.getContext('2d');

    // Draw field
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();

    // draw players
    context.fillStyle = 'white';
    context.fillRect(0, game.player1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw ball
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();
}

export function play() {
    if (GameOn == false)
        GameOn = true;
    // draw();
    // anim = requestAnimationFrame(play);
}

// export function reset() {
//     // Set ball and players to the center
//     game.ball.x = canvas.width / 2;
//     game.ball.y = canvas.height / 2;
//     game.player1.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
//     game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

//     // Reset speed
//     game.ball.speed.x = 3;
//     game.ball.speed.y = Math.random() * 3;
// }

export function stop() {

    console.log("stop game");
    PongWebSocketManager.sendStopGame();
    cancelAnimationFrame(anim);

    // reset();

    // Init score
    // game.player1.score = 0;
    // game.player2.score = 0;

    // document.querySelector('#player1-score').textContent = game.player1.score;
    // document.querySelector('#player2-score').textContent = game.player2.score;

    // draw();
    GameOn = false;
}

// Key Down
export function handleKeyDown(event, stopButton, currentPlayer) {
	if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W')
        PongWebSocketManager.sendPlayerPosition(currentPlayer, 'up');
	if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S')
		PongWebSocketManager.sendPlayerPosition(currentPlayer, 'down');
    if (event.key === ' ' && GameOn == false) {
        //play();
        spaceDown = true;
        stopButton.disabled = false;
        GameOn = true;
    }
    else if (event.key === ' ' && GameOn == true )
    {
        spaceDown = true;
        stop();
        console.log("ESPACE key down gamone = ", GameOn);
        stopButton.disabled = true;
    }
    if (event.key === "Escape")
    {
        escapeDown = true;
        stop();
        console.log("ECHAP key down gamone = ", GameOn);
        stopButton.disabled = true;
    }
    if (event.key === ' ' && !GameOn) {
        play();
        GameOn = true;
    }
}

// Key Up
export function handleKeyUp(event, currentPlayer) {
	if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W')
		PongWebSocketManager.sendPlayerPosition(currentPlayer, 'stop');
	if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S')
		PongWebSocketManager.sendPlayerPosition(currentPlayer, 'stop');
    if (event.key === "Escape")
        escapeDown = false;
    if (event.key === ' ')
        spaceDown = false;
}

