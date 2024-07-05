import { conf } from "./conf.js";

export const pong = {
	groundColor: "#000000",
	netColor: "#FFFFFF",

	groundLayer : null,
	scoreLayer : null,
	playersBallLayer : null,

	wallSound : null,
	playerSound : null,

	divGame : null,
	gameOn : false,
	gameOver : false,
	startGameButton : false,

	ball : {
		sprite : null,
		color : "#FFD700",
		directionX : 1,
		directionY : 1,
		speed : 2,
		inGame : false,

		// Mouvemement de la balle
		move : function() {
			if (this.inGame) {
				this.sprite.posX += this.directionX * this.speed;
				this.sprite.posY += this.directionY * this.speed;
			}
		},

		// Rebond de la balle sur les bords
		bounce : function() {
			if ( this.sprite.posX > conf.GroundLayerWidth || this.sprite.posX < 0 ) {
				this.directionX = -this.directionX;
				pong.wallSound.play();
			}
			if ( this.sprite.posY > conf.GroundLayerHeight || this.sprite.posY < 0  ) {
				this.directionY = -this.directionY;
				pong.wallSound.play();
			}
		},

		// Collision de la balle avec un Player
		collide : function(anotherItem) {
			if ( !( this.sprite.posX >= anotherItem.sprite.posX + anotherItem.sprite.width || this.sprite.posX <= anotherItem.sprite.posX - this.sprite.width
				|| this.sprite.posY >= anotherItem.sprite.posY + anotherItem.sprite.height || this.sprite.posY <= anotherItem.sprite.posY - this.sprite.height ) ) {
			 return true;
			}
			return false;
		},

		// Perte de la balle
		lost : function(player) {
			var returnValue = false;
			if ( player.originalPosition == "left" && this.sprite.posX < player.sprite.posX - player.sprite.width ) {
			 returnValue = true;
			} else if ( player.originalPosition == "right" && this.sprite.posX > player.sprite.posX + player.sprite.width ) {
			 returnValue = true;
			}
			return returnValue;
		},

		// Accélération de la balle
		speedUp: function() {
			this.speed = this.speed + .1;
		},
	},

	playerOne : {
		sprite : null,
		color : "#FFFFFF",
		goUp : false,
		goDown : false,
		originalPosition : "left",
		score : 0,
		ia : false,
	},
	
	playerTwo : {
		sprite : null,
		color : "#FFFFFF",
		goUp : false,
		goDown : false,
		originalPosition : "right",
		score : 0,
		ia : true,
	},

	// Initialisation du jeu
	init : function() {
		this.initScreenRes();
		// this.resizeDisplayData(conf, this.ratioResX, this.ratioResY);

		this.divGame = document.getElementById("divGame");
	
		this.startGameButton = document.getElementById("startGame");
		this.startGameButton.addEventListener("click", pong.control.onStartGameClickButton);
		
		this.groundLayer = pong.display.createLayer("GROUND", conf.GroundLayerWidth, conf.GroundLayerHeight, this.divGame, 0, "#000000", 10, 50); 
		pong.display.drawRectangleInLayer(this.groundLayer, conf.netWidth, conf.GroundLayerHeight, this.netColor, conf.GroundLayerWidth/2 - conf.netWidth/2, 0);
		
		this.scoreLayer = pong.display.createLayer("SCORE", conf.GroundLayerWidth, conf.GroundLayerHeight, this.divGame, 1, undefined, 10, 50);
		
		this.playersBallLayer = pong.display.createLayer("JOUEURSETBALLE", conf.GroundLayerWidth, conf.GroundLayerHeight, this.divGame, 2, undefined, 10, 50);  
		
		this.displayScore(0,0);
		
		this.ball.sprite = pong.display.createSprite(conf.BallWidth, conf.BallHeight, conf.BallPosX, conf.BallPosY, "./js/img/ball.png");
		this.displayBall(200,200);
		
		this.playerOne.sprite = pong.display.createSprite(conf.PlayerOneWidth, conf.PlayerOneHeight, conf.PlayerOnePosX, conf.PlayerOnePoxY, "./js/img/paddle.png");
		this.playerTwo.sprite = pong.display.createSprite(conf.PlayerTwoWidth, conf.PlayerTwoWidth, conf.PlayerTwoPosX, conf.PlayerTwoPoxY, "./js/img/paddle.png");
		this.displayPlayers();
		
		this.initKeyboard(pong.control.onKeyDown, pong.control.onKeyUp); 
		// this.initMouse(pong.control.onMouseMove);
		
		this.wallSound = new Audio("./js/sound/wall.ogg");
		this.playerSound = new Audio("./js/sound/player.ogg");
		
		pong.ia.setPlayerAndBall(this.playerTwo, this.ball);
		pong.speedUpBall();
	},


// AFFICHAGE
	// Affichage du score
	displayScore : function(scorePlayer1, scorePlayer2) {
		// pong.display.drawTextInLayer(this.scoreLayer, scorePlayer1, conf.ScoreFontSize + "pt DS-DIGIB", "#FFFFFF", conf.ScorePosXPlayer1, conf.ScorePosYPlayer1);
		// pong.display.drawTextInLayer(this.scoreLayer, scorePlayer2, conf.ScoreFontSize + "pt DS-DIGIB", "#FFFFFF", conf.ScorePosXPlayer2, conf.ScorePosYPlayer2);
	    pong.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", conf.ScorePosXPlayer1, conf.ScorePosYPlayer1);
		pong.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", conf.ScorePosXPlayer2, conf.ScorePosYPlayer2);
	},

	// Affichage de la balle
	displayBall : function() {
		pong.display.drawImageInLayer(this.playersBallLayer, this.ball.sprite.img, this.ball.sprite.posX, this.ball.sprite.posY);
	},

	// Affichage des joueurs
	displayPlayers : function() {
		pong.display.drawImageInLayer(this.playersBallLayer, this.playerOne.sprite.img, this.playerOne.sprite.posX, this.playerOne.sprite.posY);
		pong.display.drawImageInLayer(this.playersBallLayer, this.playerTwo.sprite.img, this.playerTwo.sprite.posX, this.playerTwo.sprite.posY);
	},

	// Nettoyage des calques
	clearLayer : function(targetLayer) {
		targetLayer.clear();
	},

// DÉROULEMENT
	// Déplacement de la balle
	moveBall : function() { 
		this.ball.move();
		this.ball.bounce(this.wallSound);
		this.displayBall();
	},

	// Déplacement des joueurs
	movePlayers : function() {
		if ( pong.control.controlSystem == "KEYBOARD" ) {
			if ( pong.playerOne.goUp ) {
				console.log("goUp");
				if ( pong.playerOne.sprite.posY > 0) {
					pong.playerOne.sprite.posY -= 5;
				}
			} else if ( pong.playerOne.goDown ) {
				console.log("goDown");
				if (pong.playerOne.sprite.posY + pong.playerOne.sprite.height < conf.GroundLayerHeight) { 
					pong.playerOne.sprite.posY += 5;
				}
			}
		} else if ( pong.control.controlSystem == "MOUSE" ) {
			if (pong.playerOne.goUp && pong.playerOne.sprite.posY > pong.control.mousePointer)
				if ( pong.playerOne.sprite.posY > 0 ) {
				pong.playerOne.sprite.posY -= 5;
				}
			else if (pong.playerOne.goDown && pong.playerOne.sprite.posY < pong.control.mousePointer)
				if (pong.playerOne.sprite.posY + pong.playerOne.sprite.height < conf.GroundLayerHeight) { 
					pong.playerOne.sprite.posY += 5;
				}
		}
	},

	// Mouvement des joueurs avec le clavier
	initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
		window.onkeydown = onKeyDownFunction;
		window.onkeyup = onKeyUpFunction;
	},

	// Mouvement des joueurs avec la souris
	initMouse : function(onMouseMoveFunction) {
		window.onmousemove = onMouseMoveFunction;
	},

	// Perte de la balle
	lostBall: function() {
		if (this.ball.lost(this.playerOne)) {
			this.playerTwo.score++;
			if (this.playerTwo.score >= 2) {
				console.log("Player Two wins!");
				this.gameOn = false;
				this.gameOver = true;
			} else {
				this.ball.inGame = false;
				if (this.playerOne.ia) {
					setTimeout(() => { pong.ia.startBall(); }, 2000);
				}
			}
		} else if (this.ball.lost(this.playerTwo)) {
			this.playerOne.score++;
			if (this.playerOne.score >= 2) {
				console.log("Player One wins!");
				this.gameOn = false;
				this.gameOver = true;
			} else {
				this.ball.inGame = false;
				if (this.playerTwo.ia) {
					setTimeout(() => { pong.ia.startBall(); }, 2000);
				}
			}
		}
	
		this.scoreLayer.clear();
		console.log("Score : " + this.playerOne.score + " - " + this.playerTwo.score);
		this.displayScore(this.playerOne.score, this.playerTwo.score);
	},

	// Collision de la balle avec les joueurs
	collideBallWithPlayersAndAction : function() { 
		if ( this.ball.collide(pong.playerOne) ) {
			this.changeBallPath(pong.playerOne, pong.ball);
			pong.playerSound.play();
		}
		if ( this.ball.collide(pong.playerTwo) ) {
			this.changeBallPath(pong.playerTwo, pong.ball);
			pong.playerSound.play();
		}
	},

	// Vérification de la position de la balle sur le joueur pour changer la trajectoire
	ballOnPlayer : function(player, ball) {
		var returnValue = "CENTER";
		var playerPositions = player.sprite.height/5;
		if ( ball.sprite.posY > player.sprite.posY && ball.sprite.posY < player.sprite.posY + playerPositions ) {
		  returnValue = "TOP";
		} else if ( ball.sprite.posY >= player.sprite.posY + playerPositions && ball.sprite.posY < player.sprite.posY + playerPositions * 2 ) {
		  returnValue = "MIDDLETOP";
		} else if ( ball.sprite.posY >= player.sprite.posY + playerPositions*2 && ball.sprite.posY < player.sprite.posY + 
		  player.sprite.height - playerPositions ) {
		  returnValue = "MIDDLEBOTTOM";
		} else if ( ball.sprite.posY >= player.sprite.posY + player.sprite.height - playerPositions && ball.sprite.posY < player.sprite.posY + 
		  player.sprite.height ) {
		  returnValue = "BOTTOM";
		}
		return returnValue;
	},

	// Changement de trajectoire de la balle
	changeBallPath : function(player, ball) {
		if ( player.originalPosition == "left" ) {
		  switch( pong.ballOnPlayer(player, ball) ) {
			case "TOP":
			  ball.directionX = 1;
			  ball.directionY = -2;
			  break;
			case "MIDDLETOP":
			  ball.directionX = 1;
			  ball.directionY = -1;
			  break;
			case "CENTER":
			  ball.directionX = 1;
			  ball.directionY = 0;
			  break;
			case "MIDDLEBOTTOM":
			  ball.directionX = 1;
			  ball.directionY = 1;
			  break;
			case "BOTTOM":
			  ball.directionX = 1;
			  ball.directionY = 2;
			  break;
		  }
		} else {
		  switch( pong.ballOnPlayer(player, ball) ) {
			case "TOP":
			  ball.directionX = -1;
			  ball.directionY = -2;
			  break;
			case "MIDDLETOP":
			  ball.directionX = -1;
			  ball.directionY = -1;
			  break;
			case "CENTER":
			  ball.directionX = -1;
			  ball.directionY = 0;
			  break;
			case "MIDDLEBOTTOM":
			  ball.directionX = -1;
			  ball.directionY = 1;
			  break;
			case "BOTTOM":
			  ball.directionX = -1;
			  ball.directionY = 2;
			  break;
		  }
		}
	},

	// Fonction pour accélérer la balle toutes les 5 secondes
	speedUpBall: function() { 
		setInterval(function() {
		  pong.ball.speedUp();
		}, 5000);
	},
	
// ------------------------------

	// Bouton pour démarrer le jeu
	initStartGameButton : function() {
		this.startGameButton.onclick = pong.control.onStartGameClickButton;
	},

	// Réinitialisation du jeu
	reinitGame : function() {
		this.ball.inGame = false;
		this.gameOver = false;
		this.ball.speed = 2;
		this.playerOne.score = 0;
		this.playerTwo.score = 0;
		this.scoreLayer.clear();
		this.displayScore(this.playerOne.score, this.playerTwo.score);
	},

// ------------------------------ 

	// Calcul des valeurs pour la résolution
	initScreenRes : function() {
		this.targetResX = window.screen.availWidth;
		this.targetResY = window.screen.availHeight;
		this.ratioResX = this.targetResX / this.devResX;
		this.ratioResY = this.targetResY / this.devResY;
		// Affichage des valeurs de ratio
		console.log("targetResX : " + this.targetResX + " targetResY : " + this.targetResY);
		console.log("ratioResX : " + this.ratioResX + " ratioResY : " + this.ratioResY);
	},

	// Fonction de redimensionnement
	resizeDisplayData : function(object, ratioX, ratioY) {
		var property;
		for ( property in object ) { 
		  if ( property.match(/^.*X.*$/i) || property.match(/^.*WIDTH.*$/i) ) {
			object[property] = Math.round(object[property] * ratioX);
		  } else {
			object[property] = Math.round(object[property] * ratioY);
		  }
		}
	},
};