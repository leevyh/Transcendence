export const PongWebSocketManager = {
    socket: null,

    // Initialise la WebSocket avec l'URL du serveur
    init(url) {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };
    },

    // Envoie la position du joueur
    sendPlayerPosition(current_player, move) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = {
                type: 'update_position',
                player: current_player,
                position: move,
            };
            this.socket.send(JSON.stringify(data));
        }
    },
};