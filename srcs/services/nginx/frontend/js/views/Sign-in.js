import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Sign-in");
	}

	async getHtml() {
		return `
		  <head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
			<meta name="description" content="">
			<meta name="author" content="">
			<link rel="icon" href="/docs/4.0/assets/img/favicons/favicon.ico">
		
			<title>Sign-in</title>

			<!-- Bootstrap core CSS -->
			<link href="../../dist/css/bootstrap.min.css" rel="stylesheet">
		
			<!-- Custom styles for this template -->
			<link href="signin.css" rel="stylesheet">
		  </head>
		
		  <body class="text-center">
			<form class="form-signin">
			  <h1 data-i18n="signin" class="h3 mb-3 font-weight-normal">Please sign in</h1>
			  <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
			  <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
			  <div class="checkbox mb-3">
				<label>
				  <input type="checkbox" value="remember-me"> Remember me
				</label>
			  </div>
			  <div id="login">
				<button data-i18n="sign" type="button" class="btn btn-outline-primary">Sign in</button>
				<button data-i18n="sign42" type="button" class="btn btn-dark">Sign in with <img class="logo42" src="/js/img/42_logo_white.svg"></button>
			  </div>
			</form>
		  </body>	
		`;
	}
}
