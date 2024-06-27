import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Dashboard");
	}

	async getHtml() {
		return `
			<div id ="dashboard">
				<h1 data-i18n="welcome">Welcome, Dom!</h1>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
					odio sit amet nulla faucibus fringilla. Nullam quis ante sit amet
					lorem ultricies tincidunt. Nullam nec odio sit amet nulla faucibus
					fringilla. Nullam quis ante sit amet lorem ultricies tincidunt.
				</p>
				<p>
					<a href="/pong" data-link>Play Pong</a>.
				</p>
			</div>
		`;
	}
}

{/* <div id="language">
<select id="language-selector">
	<option value="en">🇬🇧&emsp;EN</option>
	<option value="fr">🇫🇷&emsp;FR</option>
	<option value="es">🇪🇸&emsp;ES</option>
</select>
</div> */}
