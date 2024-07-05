import { pong } from './game.js';

pong.keycode = { 
	DOWN : 40,
	UP : 38,
	SPACEBAR : 32
}

pong.control = {
	controlSystem : null,
	mousePointer : null,

	// Fonction de gestion des événements clavier (appui)
	onKeyDown : function(event) {
		pong.control.controlSystem = "KEYBOARD";

		if ( event.keyCode == pong.keycode.DOWN ) {
			pong.playerOne.goDown = true;
		} else if ( event.keyCode == pong.keycode.UP ) {
			pong.playerOne.goUp = true;
		}
		if ( event.keyCode == pong.keycode.SPACEBAR && !pong.ball.inGame && pong.gameOn ) { 	
			pong.ball.inGame = true;
			pong.ball.sprite.posX = pong.playerOne.sprite.posX + pong.playerOne.sprite.width;
			pong.ball.sprite.posY = pong.playerOne.sprite.posY;
			pong.ball.directionX = 1;
			pong.ball.directionY = 1;
		}
	},

	// Fonction de gestion des événements clavier (relâchement)
	onKeyUp : function(event) {
		pong.control.controlSystem = "KEYBOARD";

		if ( event.keyCode == pong.keycode.DOWN ) {
			pong.playerOne.goDown = false;
		} else if ( event.keyCode == pong.keycode.UP ) {
			pong.playerOne.goUp = false;
		}
	},

	// Fonction de gestion des événements souris (déplacement)				ABORTED
	onMouseMove : function(event) {
		pong.control.controlSystem = "MOUSE";
		if ( event ) {
			pong.control.mousePointer = event.clientY;
		}
		if ( pong.control.mousePointer > pong.playerOne.sprite.posY ) {
			pong.playerOne.goDown = true;
			pong.playerOne.goUp = false;
		} else if ( pong.control.mousePointer < pong.playerOne.sprite.posY ) {
			pong.playerOne.goDown = false;
			pong.playerOne.goUp = true;
		} else {
			pong.playerOne.goDown = false;
			pong.playerOne.goUp = false;
		}
	},

	// Fonction de gestion des événements souris (clic on StartButton)
	onStartGameClickButton : function(event) {
		if ( event && !pong.gameOn ) {
			pong.gameOn = true;
			pong.reinitGame();
		}
	}
}
