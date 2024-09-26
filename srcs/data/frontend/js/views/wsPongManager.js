// pong_wb_manager.js
export const PongWebSocketManager = {
    socket: null,

    // Initialise la WebSocket avec l'URL du serveur
    init(url) {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);

            // En fonction du type de message reçu, on appelle la fonction appropriée
            if (data.action_type === 'update_position') {
                this.updateOpponentPosition(data.player_position);
            } else if (data.action_type === 'update_ball_position') {
                this.updateBallPosition(data.ball_position);
            } else if (data.action_type === 'update_score') {
                this.updateScore(data.scores);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    },

    // Envoie la position du joueur
    sendPlayerPosition(playerY) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = {
                action_type: 'update_position',
                player_position: playerY
            };
            this.socket.send(JSON.stringify(data));
        }
    },

    // Envoie la position de la balle
    sendBallPosition(ballPosition) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = {
                action_type: 'update_ball_position',
                ball_position: ballPosition
            };
            console.log('Sending ball position:', data);
            this.socket.send(JSON.stringify(data));
        }
    },

    // Envoie la mise à jour du score
    sendScore(scores) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = {
                action_type: 'update_score',
                scores: scores
            };
            this.socket.send(JSON.stringify(data));
        }
    },

    // Fonction appelée pour mettre à jour la position de l'adversaire
    updateOpponentPosition(opponentPosition) {
        console.log('Updating opponent position:', opponentPosition);
    },

    // Fonction appelée pour mettre à jour la position de la balle
    updateBallPosition(ballPosition) {
        console.log('Updating ball position:', ballPosition);
        game.ball.x = ballPosition.x;
        game.ball.y = ballPosition.y;
    },

    // Fonction appelée pour mettre à jour le score
    updateScore(scores) {
        console.log('Updating scores:', scores);
        document.querySelector('#player1-score').textContent = scores.player;
        document.querySelector('#player2-score').textContent = scores.computer;
    }
};