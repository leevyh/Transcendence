import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Pong");
	}

	async getHtml() {
		return `
			<h1>Pong</h1>
			<p data-i18n="pong">There will be a Pong Game here soon!</p>
		`;
	}
}

