pong.keycode = { 
	KEYDOWN : 40,
	KEYUP : 38
}

pong.control = {
	controlSystem : null,
	mousePointer : null,

	onKeyDown : function(event) {
		pong.control.controlSystem = "KEYBOARD";

		if ( event.keyCode == pong.keycode.KEYDOWN ) {
			pong.playerOne.goDown = true;
		} else if ( event.keyCode == pong.keycode.KEYUP ) {
			pong.playerOne.goUp = true;
		}
	},

	onKeyUp : function(event) {
		pong.control.controlSystem = "KEYBOARD";

		if ( event.keyCode == pong.keycode.KEYDOWN ) {
			pong.playerOne.goDown = false;
		} else if ( event.keyCode == pong.keycode.KEYUP ) {
			pong.playerOne.goUp = false;
		}
	},

	onMouseMove : function (event) {
		pong.control.controlSystem = "MOUSE";

		if ( event ) {
			pong.control.mousePointer = event.clientY;
		}
		  
		if ( pong.control.mousePointer > pong.playerOne.posY ) {
			pong.playerOne.goDown = true;
			pong.playerOne.goUp = false;
		} else if ( pong.control.mousePointer < pong.playerOne.posY ) {
			pong.playerOne.goDown = false;
			pong.playerOne.goUp = true;
		} else {
			pong.playerOne.goDown = false;
			pong.playerOne.goUp = false;
		}
	},
}

pong.ia = {
	player : null,
	ball : null,

	setPlayerAndBall : function(player, ball) {
		this.player = player;
		this.ball = ball;
	},

	move : function() {
		if ( this.ball.directionX == 1 ) {
			if ( this.player.originalPosition == "right" ) {
			 this.followBall();
			}
			if ( this.player.originalPosition == "left" ) {
			 this.goCenter();
			}
		} else {
			if ( this.player.originalPosition == "right" ) {
			 this.goCenter();
			}
			if ( this.player.originalPosition == "left" ) {
			 this.followBall();
			}
		}
	},

	followBall : function() {
		if ( this.ball.posY < this.player.posY + this.player.height/2 ) {
			this.player.posY--;
		} else if ( this.ball.posY > this.player.posY + this.player.height/2 ) {
			this.player.posY++;
		}
	},
	
	goCenter : function() {
		if ( this.player.posY + this.player.height/2 > pong.groundHeight / 2 ) {
			this.player.posY--;
		} else if ( this.player.posY + this.player.height/2 < pong.groundHeight / 2 ) {
			this.player.posY++;
		}
	},
}



