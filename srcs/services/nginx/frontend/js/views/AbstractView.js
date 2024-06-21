export default class {
	constructor() {
		// if (new.target === AbstractView) {
		// 	throw new TypeError("Cannot construct Abstract instances directly");
		// }
	}

	setTitle(title) {
		document.title = title;
	}

	async getHtml() {
		return "";
	}
}
