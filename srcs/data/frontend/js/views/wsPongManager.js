export const PongWebSocketManager = {
    socket: null,

    // Initialise la WebSocket avec l'URL du serveur
    init(url) {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };
    },

    sendGameStarted() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = {
                type: 'game_started',
            };
            this.socket.send(JSON.stringify(data));
        }
    },

    // Envoie la position du joueur
    sendPlayerPosition(current_player, move, player_name, game_name) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = {
                type: 'update_player_position',
                player: current_player,
                move: move,
                player_name: player_name,
                game: game_name,
            };
            this.socket.send(JSON.stringify(data));
        }
    },

    sendStopGame() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = {
                type: 'stop_game',
            };
            this.socket.send(JSON.stringify(data));
        }
    }
};