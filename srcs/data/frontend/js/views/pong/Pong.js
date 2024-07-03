import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Pong");
	}

	async getHtml() {
		console.log("getHtml() called from game.js");
		return `
			<h1>Pong</h1>
			<p data-i18n="pong">There will be a Pong Game here, soon...</p>
			<div style="display: flex; justify-content: center; align-items: center;">
				<canvas id="terrain" width="700" height="400" style="background: rgb(0, 0, 0);"></canvas>
			</div>

		`;
	}
}




