import AbstractView from "./AbstractView.js";
import { generateChatView } from "./coponent/Chat_coponent.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("404 - Page Not Found");
	}

	async () {
        const div = document.getElementById('app');
        div.appendChild(generateChatView());

        return div;
	}
}


{/* <head>
    <title>django-channel-chat</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js "></script>
    <style>
        #roomSelect {
            height: 300px;
        }
    </style>
</head>
<body>
    <div class="container mt-3 p-5">
        <h2>django-channel-chat</h2>
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
                    {% for room in rooms %}
                    <option>{{ room }}</option>
                    {% endfor %}
                </select>
            </div>
        </div>
    </div>
</body> */}