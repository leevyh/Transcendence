import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("404 - Page Not Found");
	}

	async getHtml() {
		return `
        <head>
            <title>django-channel-chat</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js "></script>
            <style>
                #chatLog {
                    height: 300px;
                    background-color: #FFFFFF;
                    resize: none;
                }
                #onlineUsersSelector {
                    height: 300px;
                }
            </style>
        </head>
        <body>
            <div class="container mt-3 p-5">
                <h2>django-channel-chat</h2>
                <div class="row">
                    <div class="col-12 col-md-8>
                        <div class="mb-2">
                            <label for="chatLog">Room: #{{ room.name }}</label>
                            <textarea id="chatLog" class="form-control" readonly></textarea>
                        </div>
                        <div class="input-group">
                            <input type="text" id="chatMessageInput" class="form-control" placeholder="Type a message...">
                            <div class="input-group-append">
                                <button type="button" id="chatMessageSend" class="btn btn-success">Send</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <label for="onlineUsers">Online users:</label>
                        <select multiple class="form-control" id="onlineUsersSelector">
                        </select>
                    </div>
                </div>
                {{ room.name| json_script:"roomName" }}
            </div>
            <script src="{% static 'room.js' %}"></script>
        </body>
        `;
    }
}