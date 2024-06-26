import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("404 - Page Not Found");
	}

	async getHtml() {
		return `
			<h1>Oops !</h1>
			<p>
				Error #404: Page not found.
			</p>
		`;
	}
}

