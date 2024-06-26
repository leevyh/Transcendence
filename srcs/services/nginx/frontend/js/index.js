import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import Settings from "./views/Settings.js";
import NotFound from "./views/404.js";

const navigateTo = url => {
	  history.pushState(null, null, url);
	  router();
};

const router = async () => {
  const routes = [
	{ path: "/", view: Dashboard },
	{ path: "/posts", view: Posts },
	{ path: "/settings", view: Settings },
	{ path: "/404", view: NotFound }
  ];

  // Test each route for potential match
  const potentialMatches = routes.map(route => {
	return {
	  route: route,
	  isMatch: location.pathname === route.path
	};
  });

  let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

  // If no route is found, default to the 404 page
  if (!match) {
	match = {
	  route: routes.find(route => route.path === "/404"),
	  isMatch: true
	};
  }

  const view = new match.route.view();

  document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
	if (e.target.matches("[data-link]")) {
	  e.preventDefault();
	  navigateTo(e.target.href);
	}
  });
  router();
});
