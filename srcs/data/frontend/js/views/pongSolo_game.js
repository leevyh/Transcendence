export { canvas } from './pongSolo.js'; // space game
// export var game; // statut game
export var anim;

var game = {
	player: {
		score: 0
	},
	computer: {
		score: 0,
		speedRatio: 0.75
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

var playerMovingUp = false;
var playerMovingDown = false;
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

    // draw player
    context.fillStyle = 'white';
    context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw ball
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();
}

export function changeDirection(playerPosition) {
    var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);

    // get value 0 and 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

export function movePlayerWithKeyboard() {
    if (playerMovingUp) {
        game.player.y -= PLAYER_SPEED;
    }
    if (playerMovingDown) {
        game.player.y += PLAYER_SPEED;
    }

    // player don't exit of canva
    if (game.player.y < 0) {
        game.player.y = 0;
    } else if (game.player.y > canvas.height - PLAYER_HEIGHT) {
        game.player.y = canvas.height - PLAYER_HEIGHT;
    }
}

export function computerMove() {
    game.computer.y += game.ball.speed.y * game.computer.speedRatio;
}

export function collide(player) {
    // The player does not hit the ball
    if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {
        reset();

        // Update score
        if (player == game.player) {
            game.computer.score++;
            document.querySelector('#computer-score').textContent = game.computer.score;
        } else {
            game.player.score++;
            document.querySelector('#player-score').textContent = game.player.score;
        }
    } else {
        // Change direction
        game.ball.speed.x *= -1;
        changeDirection(player.y);

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
        collide(game.computer);
    } else if (game.ball.x < PLAYER_WIDTH) {
        collide(game.player);
    }

    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}

export function play() {

    if (GameOn == false)
        GameOn = true;
    draw();
    movePlayerWithKeyboard();
    computerMove();
    ballMove();
    anim = requestAnimationFrame(play);
}

export function reset() {
    // Set ball and players to the center
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

    // Reset speed
    game.ball.speed.x = 3;
    game.ball.speed.y = Math.random() * 3;
}

export function stop() {

    console.log("start of stop");
    cancelAnimationFrame(anim);
    reset();

    // Init score
    game.computer.score = 0;
    game.player.score = 0;

    document.querySelector('#computer-score').textContent = game.computer.score;
    document.querySelector('#player-score').textContent = game.player.score;

    draw();
    GameOn = false;
}

// Key Down
export function handleKeyDown(event, startButton, stopButton) {

	if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W')
		playerMovingUp = true;
	if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S')
		playerMovingDown = true;
    if (event.key === ' ' && GameOn == false) {
        console.log("key down gamone = ", GameOn);
        play();
        spaceDown = true;
        startButton.disabled = true;
        stopButton.disabled = false;
        GameOn = true;
    }
    else if (event.key === ' ' && GameOn == true )
    {
        spaceDown = true;
        stop();
        console.log("ESPACE key down gamone = ", GameOn);
        startButton.disabled = false;
        stopButton.disabled = true;
    }
    if (event.key === "Escape")
    {
        escapeDown = true;
        stop();
        console.log("ECHAP key down gamone = ", GameOn);
        startButton.disabled = false;
        stopButton.disabled = true;
    }
    if (event.key === ' ' && !GameOn) {
        play();
        GameOn = true;
    }
}

// Key Up
export function handleKeyUp(event) {

	if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W')
		playerMovingUp = false;
	if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S')
		playerMovingDown = false;
    if (event.key === "Escape")
        escapeDown = false;
    if (event.key === ' ')
        spaceDown = false;
}