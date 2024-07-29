import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Chat");
        // const div = document.createElement('div');
        // div.appendChild(await)
	}

	async getHtml() {
		return `
        <style>
            #roomSelect {
                height: 300px;
            }
        </style>
        <div class="container mt-3 p-5">
            <h2>Chat</h2>
            <div class="row">
                <div class="col-12 col-md-8">
                    <div class="mb-2">
                        <label for="roomInput">Enter a room name to connect to it:</label>
                        <input type="text" id="roomInput" class="form-control" placeholder="Room name">
                        <small id="roomInputHelp" class="form-text text-muted">If the room doesn't exist yet, it will be created for you.</small>
                    </div>
                    <button type="button" id="roomConnect" class="btn btn-success">Connect</button>
                </div>
                <div class="col-12 col-md-4">
                    <label for="roomSelect">Active rooms:</label>
                    <select multiple class="form-control" id="roomSelect">
                        <!-- Render room options here dynamically if necessary -->
                    </select>
                </div>
            </div>
        </div>
        <script src="{% static 'chat.js' %}" defer></script>
    `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const roomConnectButton = document.getElementById('roomConnect');
    const roomInput = document.getElementById('roomInput');

    if (roomConnectButton && roomInput) {
        roomConnectButton.addEventListener('click', function() {
            const roomName = roomInput.value;

            fetch('/api/room_view/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken') // Assurez-vous d'inclure le token CSRF
                },
                body: new URLSearchParams({
                    'room_name': roomName
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(`Connected to room: ${data.room}`);
                    // Mettez à jour l'interface utilisateur si nécessaire
                }
            })
            .catch(error => console.error('Error:', error));
        });
    } else {
        console.error('Element not found');
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
