import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Settings");
	}

	async getHtml() {
		return `
			<h1 data-i18n="settings">Settings</h1>
			<p data-i18n="settings_txt">Manage your privacy and configuration settings.</p>
		`;
	}
}

