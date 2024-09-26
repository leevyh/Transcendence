export { canvas } from './pong.js'; // space game
// export var game; // statut game
import { PongWebSocketManager } from './wsPongManager.js';
export var anim;

export var game = {
    player1: {
        score: 0,
        movingDown : false,
        movingUp : false
    },
    player2: {
        score: 0,
        speedRatio: 0.75,
        movingDown : false,
        movingUp : false
    },
    ball: {
        r: 5,
        speed: {}
    }
};

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const MAX_SPEED = 10;
const PLAYER_SPEED = 9;

// var player1MovingUp = false;
// var player1MovingDown = false;
// var player2MovingUp = false;
// var player2MovingDown = false;
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

export function changeDirection(currentPlayer) {
    var impact = game.ball.y - currentPlayer.y - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);

    // get value 0 and 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

export function movePlayerWithKeyboard(currentPlayer) {
    if (currentPlayer.movingUp) {
        currentPlayer.y -= PLAYER_SPEED;
    }
    if (currentPlayer.movingDown) {
        currentPlayer.y += PLAYER_SPEED;
    }

    // player don't exit of canva
    if (currentPlayer.y < 0) {
        currentPlayer.y = 0;
    } else if (currentPlayer.y > canvas.height - PLAYER_HEIGHT) {
        currentPlayer.y = canvas.height - PLAYER_HEIGHT;
    }
    PongWebSocketManager.sendPlayerPosition(currentPlayer.y);
}

// Fonction pour mettre à jour la position du paddle de l'autre joueur
export function updateOpponentPosition(opponentPosition) {
    //game.player.y = opponentPosition;  // Met à jour la position de l'adversaire
}

export function collide(currentPlayer) {
    // The player does not hit the ball
    if (game.ball.y < currentPlayer.y || game.ball.y > currentPlayer.y + PLAYER_HEIGHT) {
        reset();

        // Update score
        if (currentPlayer == game.player2) {
            game.player2.score++;
            document.querySelector('#player2-score').textContent = game.player2.score;
        } else {
            game.player1.score++;
            document.querySelector('#player1-score').textContent = game.player1.score;
        }
        PongWebSocketManager.sendScore({
            player1: game.player1.score,
            player2: game.player2.score
        });
    } else {
        // Change direction
        game.ball.speed.x *= -1;
        changeDirection(currentPlayer);

        // Increase speed if it has not reached max speed
        if (Math.abs(game.ball.speed.x) < MAX_SPEED) {
            game.ball.speed.x *= 1.2;
        }
    }
}

export function ballMove() {
    // Rebounds on top and bottom
    if (game.ball.y > canvas.height || game.ball.y < 0) {
        game.ball.speed.y *= -1;
    }

    if (game.ball.x > canvas.width - PLAYER_WIDTH) {
        collide(game.player2);
    } else if (game.ball.x < PLAYER_WIDTH) {
        collide(game.player1);
    }

    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;

    
    PongWebSocketManager.sendBallPosition({ x: game.ball.x, y: game.ball.y });
}

export function play() {

    if (GameOn == false)
        GameOn = true;
    draw();
    //reset();
    movePlayerWithKeyboard(game.player1);
    movePlayerWithKeyboard(game.player2);
    //computerMove();
    ballMove();
    anim = requestAnimationFrame(play);
}

export function reset() {
    // Set ball and players to the center
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.player1.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

    // Reset speed
    game.ball.speed.x = 3;
    game.ball.speed.y = Math.random() * 3;
}

export function stop() {

    console.log("stop game");
    cancelAnimationFrame(anim);
    reset();

    // Init score
    game.player1.score = 0;
    game.player2.score = 0;

    document.querySelector('#player1-score').textContent = game.player1.score;
    document.querySelector('#player2-score').textContent = game.player2.score;

    draw();
    GameOn = false;
}

// Key Down
export function handleKeyDown(event, stopButton, currentPlayer) {
	if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W')
		currentPlayer.movingUp = true;
	if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S')
		currentPlayer.movingDown = true;
    if (event.key === ' ' && GameOn == false) {
        play();
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
		currentPlayer.movingUp = false;
	if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S')
		currentPlayer.movingDown = false;
    if (event.key === "Escape")
        escapeDown = false;
    if (event.key === ' ')
        spaceDown = false;
}
