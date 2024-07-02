const pong = {
	groundWidth : 700,
	groundHeight : 400,
	netWidth : 6,
	groundColor: "#000000",
	netColor: "#FFFFFF",

	groundLayer : null,  
	scoreLayer : null,
	playersBallLayer : null,

	// La position du score du joueur 1 est à 300 pixels du bord gauche du canvas html5.
	scorePosPlayer1 : 300,
	scorePosPlayer2 : 365,

	wallSound : null,
	playerSound : null,

	ball : {
		width : 10,
		height : 10,
		color : "#FFFFFF",
		posX : 200,
		posY : 200,
		speed : 1,
		move : function() {
			this.posX += this.directionX * this.speed;
			this.posY += this.directionY * this.speed;
		},
		bounce : function() {
			if ( this.posX > pong.groundWidth || this.posX < 0 ) {
				this.directionX = -this.directionX;
				soundToPlay.play();
			}
			if ( this.posY > pong.groundHeight || this.posY < 0 ) {
				this.directionY = -this.directionY;
				soundToPlay.play();
			}     
		},
		collide : function(anotherItem) {
			if ( !( this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width
				|| this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height ) ) {
			 return true;
			}
			return false;
		},
	},
	// La valeur de la vitesse correspongd à un incrément en pixels de la position de la balle. Incrément appliqué à chaque rafraichissement de l’affichage. 
	// Plus la valeur de cette propriété sera grande, plus la balle paraitra se déplacer vite. Cela peut être un des moyens pour jouer sur la difficulté du jeu.
	
	playerOne : {
		width : 10,
		height : 50,
		color : "#FFFFFF",
		posX : 30,
		posY : 200,
		goUp : false,
		goDown : false,
		originalPosition : "left",
	},
	
	playerTwo : {
		width : 10,
		height : 50,
		color : "#FFFFFF",
		posX : 650,
		posY : 200,
		goUp : false,
		goDown : false,
		originalPosition : "right",
	},

	init : function() {
		this.groundLayer = pong.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0); 
		pong.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);
		
		this.scoreLayer = pong.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
		pong.display.drawTextInLayer(this.scoreLayer, "SCORE", "10px Arial", "#FF0000", 10, 10);
		
		this.playersBallLayer = pong.display.createLayer("joueurs_et_balle", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0); 
		pong.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);
		
		this.displayScore(0,0);
		this.displayBall(200,200);
		this.displayPlayers();
 
		this.initKeyboard(pong.control.onKeyDown, pong.control.onKeyUp); 
		this.initMouse(pong.control.onMouseMove);

		this.wallSound = new Audio("./sound/wall.ogg");
		this.playerSound = new Audio("./sound/player.ogg");

		pong.ia.setPlayerAndBall(this.playerTwo, this.ball);
	},

	displayScore : function(scorePlayer1, scorePlayer2) {
		pong.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
		pong.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
	},

	displayBall : function() {
		pong.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
	},

	moveBall : function() { 
		this.ball.move();
		this.ball.bounce(this.wallSound);
		this.displayBall();
	},

	displayPlayers : function() {
		pong.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
		pong.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
	},

	movePlayers : function() {
		if ( pong.control.controlSystem == "KEYBOARD" ) {
			if ( pong.playerOne.goUp ) {
				pong.playerOne.posY-=5;
			} else if ( pong.playerOne.goDown ) {
				pong.playerOne.posY+=5;
			}
		} else if ( pong.control.controlSystem == "MOUSE" ) {
			if (pong.playerOne.goUp && pong.playerOne.posY > pong.control.mousePointer)
				pong.playerOne.posY-=5;
			else if (pong.playerOne.goDown && pong.playerOne.posY < pong.control.mousePointer)
				pong.playerOne.posY+=5;
		}
	},

	clearLayer : function(targetLayer) {
		targetLayer.clear();
	},

	// Mouvement des joueurs avec le clavier et la souris
	initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
		window.onkeydown = onKeyDownFunction;
		window.onkeyup = onKeyUpFunction;
	},

	initMouse : function(onMouseMoveFunction) {
		window.onmousemove = onMouseMoveFunction;
	},

	collideBallWithPlayersAndAction : function() { 
		if ( this.ball.collide(pong.playerOne) ) {
			pong.ball.directionX = -pong.ball.directionX;
			pong.playerSound.play();
		}
		if ( this.ball.collide(pong.playerTwo) ) {
			pong.ball.directionX = -pong.ball.directionX;
			pong.playerSound.play();
		}
	},  
};


