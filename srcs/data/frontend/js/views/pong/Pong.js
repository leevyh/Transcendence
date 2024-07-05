import AbstractView from "../AbstractView.js";


export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Pong");
	}

	async getHtml() {
		return `
			<h1>Pong</h1>
			<script type="module" src="Pong.js"></script>
			<div id="bloc" style="display: flex;flex-direction: column;">
				<!-- <div id="menu"><input id="startGame" style="width:120px" type="image" src="./img/startBtn.png"></div> -->
				<div id="menu" style="display: flex;justify-content: center;padding: 10px;"><input id="startGame" type="button" value="Start Game" stye="justify-content: center;"></div>
				<div id="divGame" style="display: flex;justify-content: center;/* width: 1000px; */background-color: azure;/* height: 1000px; */"><canvas id="GROUND" width="700" height="400" style="background: rgb(0, 0, 0); z-index: 0; position: absolute; left: auto; top: auto;"></canvas><canvas id="SCORE" width="700" height="400" style="z-index: 1; position: absolute; left: auto; top: auto;"></canvas><canvas id="JOUEURSETBALLE" width="700" height="400" style="z-index: 2; position: absolute; left: auto; top: auto;"></canvas></div>
			</div>
		`;
	}
}




