import {isAuthenticated} from "./utils.js";

class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.callbacks = [];
        this.isConnected = false;
        this.token = localStorage.getItem('token');
    }


    async connect(){
        if (this.token) {
            //Check token validity with backend
            const status_token = await isAuthenticated();
            if (!status_token) {
                console.error('Invalid token');
                return;
            }
            this.socket = new WebSocket(this.url);
            this.socket.onopen = () => {
                console.log('WebSocket connection established');
                this.isConnected = true;
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Received notification:', data);

                this.callbacks.forEach(callback => callback(data));
            };

            this.socket.onclose = () => {
                // console.log('WebSocket connection closed:');
                this.isConnected = false;
                setTimeout(() => this.connect(), 5000);
            };
            this.socket.onerror = error => {
                // console.error('WebSocket error:', error);
            };
        } else {
            console.error('No token found');
        }
    }

    send(data){
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log("Sending data: ", data);
            this.socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    AddNotificationListener(callback) {
        this.callbacks.push(callback);
    }

    RemoveNotificationListener(callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }
}
const wsManager = new WebSocketManager('wss://' + window.location.host + '/wss/friend_request/');
export default wsManager;

wsManager.connect();