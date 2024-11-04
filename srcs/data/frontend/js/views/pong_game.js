export { canvas } from './pong.js'; // space game
import { inTournament } from './pong.js';
// export var game; // statut game
import { PongWebSocketManager } from './wsPongManager.js';
import {fetchUserGameSettings} from './menuPong.js';
import { getCookie } from './utils.js';
export var anim;

const GAME_HEIGHT = 240
const GAME_WIDTH = 640
const PLAYER_HEIGHT = 80;
const PLAYER_WIDTH = 5;
const MAX_SPEED = 10;
const PLAYER_SPEED = 9;

export var game = {
    game_name: null,
    player1: {
        name: null,
        x: PLAYER_WIDTH,
        y: GAME_HEIGHT,
        dy: PLAYER_SPEED
    },
    player2: {
        name: null,
        x: 640 - PLAYER_WIDTH,
        y: GAME_HEIGHT,
        dy: PLAYER_SPEED
    },
    ball: {
        r : 5,
        x: 640 / 2,
        y: 480 / 2,
        radius: 10
    }
};

const colorMapping = {
	'black': '#000000',
	'white': '#fdfefe',
	'purple': '#7d3c98',
	'pink': '#FFC0CB',
	'yellow': '#f4d03f',
	'green': '#229954',
	'gray': '#a6acaf',
	'blue': '#1a5276',
	'lila': '#d7bde2',
	'red': '#c0392b',
	'brown': '#873600',
	'green_light': '#58d68d',
	'blue_light': '#85c1e9'
};


var escapeDown = false;
export let GameOn = false;
var spaceDown = false;

var background_color_key;
var pads_color_key;
var ball_color_key;

async function get_gameSettings_drawing_duo() {
    const response = await fetch('/api/game_settings/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    background_color_key = data.background_game;
    pads_color_key = data.pads_color;
    ball_color_key = data.ball_color;
}

export async function initialize_color_duo() {
    await get_gameSettings_drawing_duo();

}

export function draw() {
    var context = canvas.getContext('2d');

    const background_color  = colorMapping[background_color_key] || "#000";
    const pads_color = colorMapping[pads_color_key] || "#fdfefe";
    const ball_color =colorMapping[ball_color_key] || "#fdfefe";

    // Draw field
    context.fillStyle = background_color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();

    // draw players
    context.fillStyle = pads_color;
    context.fillRect(0, game.player1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw ball
    context.beginPath();
    context.fillStyle = ball_color;
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();
}

export function play() {
    if (GameOn == false)
        GameOn = true;
}

export function stop() {

    console.log("stop game");
    PongWebSocketManager.sendStopGame(game.game_name);
    cancelAnimationFrame(anim);
    GameOn = false;
}

export function endOfGame(winner) {
    console.log("end of game");
    cancelAnimationFrame(anim);
    GameOn = false;
}

// Key Down
export function handleKeyDown(event, stopButton, currentPlayer, player_name, game_name) {
	if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W')
        PongWebSocketManager.sendPlayerPosition(currentPlayer, 'up', player_name, game_name);
	if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S')
		PongWebSocketManager.sendPlayerPosition(currentPlayer, 'down', player_name, game_name);
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
export function handleKeyUp(event, currentPlayer, player_name, game_name) {
	if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W')
		PongWebSocketManager.sendPlayerPosition(currentPlayer, 'stop up', player_name, game_name);
	if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S')
		PongWebSocketManager.sendPlayerPosition(currentPlayer, 'stop down', player_name, game_name);
    if (event.key === "Escape")
        escapeDown = false;
    if (event.key === ' ')
        spaceDown = false;
}

