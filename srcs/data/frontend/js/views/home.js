// // import { navigateTo } from './utils.js';

// export function homeView(container) {
//     // Clear previous content
//     container.innerHTML = '';

//     // Create elements
//     const h1 = document.createElement('h1');
//     h1.textContent = 'Home';
//     h1.className = 'pagetitle';

//     const p = document.createElement('p');
//     p.textContent = 'Welcome to the Home page!';

//     // Create button to go to login page
//     // const button = document.createElement('button');
//     // button.textContent = 'Go to Login';
//     // button.addEventListener('click', function() {
//     //     navigateTo('/login');
//     // });

//     // Append elements to container
//     container.appendChild(h1);5
//     container.appendChild(p);
//     // container.appendChild(button);

//     // TEST KARL
//     const h3 = document.createElement('h3');
//     h3.textContent = 'KARL';
//     container.appendChild(h3);
//     // FIN TEST KARL
// }

// export function homeView()
// {
//     return `
//        <nav class="navbar fixed-top bg-body-tertiary">
//             <div class="container-fluid">
//                 <a class="navbar-brand">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
//                         <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
//                     </svg>
//                 </a>
//                 <div class="nav-icon".
//                     <a class="navbar-brand">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="currentColor" class="bi bi-controller" viewBox="0 0 16 16">
//                             <path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1z"/>
//                             <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729q.211.136.373.297c.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466s.34 1.78.364 2.606c.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527s-2.496.723-3.224 1.527c-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.3 2.3 0 0 1 .433-.335l-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a14 14 0 0 0-.748 2.295 12.4 12.4 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.4 12.4 0 0 0-.339-2.406 14 14 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27s-2.063.091-2.913.27"/>
//                         </svg>
//                     </a>
//                     <a class="navbar-brand">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
//                             <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
//                         </svg>
//                     </a>
//                     <a class="navbar-brand">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
//                             <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
//                         </svg>
//                     </a>

//                     <a class="navbar-brand">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
//                             <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
//                         </svg>
//                     </a>
//                 </div>
//                 <form class="d-flex" role="search">
//                     <input class="form-control me-2" type="search" placeholder="Username" aria-label="Search">
//                     <button class="btn btn-outline-success" type="submit">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
//                             <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
//                         </svg>
//                     </button>
//                 </form>
//             </div>
//         </nav>
//         <div class="base">
//             <h5 class="title">Welcome</h5>
//             <div class="contener">
//                     <div class="card-body">
//                         <p>This is our transcendence homepage. This project involves creating a website for the mighty Pong competition! We hope you enjoy your visit to our site.</p>
//                         <ul>
//                             <li>
//                                 <a href="#" class="btn btn-primary" class="ButtonWelcome">Sign in</a>
//                             </li>
//                             <li>
//                                 <a href="/register" class="btn btn-primary" class="ButtonWelcome">Register</a>
//                             </li>
//                         </ul>

//                     </div>
//                 <img src="/assets/pong.png" class="object-fit-fill border rounded" alt="">
//             </div>
//         </div>
//     `;
// }


// Fonction pour créer un élément SVG
// function createSVG(svgClass, pathData) {
//     const brandLink = document.createElement('a');
//     brandLink.className = 'navbar-brand';

//     const svg = document.createElement('svg');
//     svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
//     svg.setAttribute('width', '30');
//     svg.setAttribute('height', '24');
//     svg.setAttribute('fill', 'currentColor');
//     svg.className = svgClass;
//     svg.setAttribute('viewBox', '0 0 16 16');

//     const path = document.createElement('path');
//     path.setAttribute('d', pathData);

//     svg.appendChild(path);
//     brandLink.appendChild(svg);

//     return brandLink;
// }

// export function homeView(container1)
// {
//     // Clear previous content
//     container1.innerHTML = '';

//     // Création des éléments pour la barre de navigation
//     const nav = document.createElement('nav');
//     nav.className = 'navbar fixed-top bg-body-tertiary';
//     container1.appendChild(nav);

//     const container = document.createElement('div');
//     container.className = 'container-fluid';
//     container1.appendChild(container);

//     const brandLink1 = document.createElement('a');
//     brandLink1.className = 'navbar-brand';

//     const svg1 = document.createElement('svg');
//     svg1.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
//     svg1.setAttribute('width', '30');
//     svg1.setAttribute('height', '24');
//     svg1.setAttribute('fill', 'currentColor');
//     svg1.className = 'bi bi-house-door-fill';
//     svg1.setAttribute('viewBox', '0 0 16 16');

//     const path1 = document.createElement('path');
//     path1.setAttribute('d', 'M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5');

//     // Construction de l'élément SVG
//     svg1.appendChild(path1);
//     brandLink1.appendChild(svg1);
//     container.appendChild(brandLink1);

//     // Création des autres icônes dans la barre de navigation
//     const navIcon = document.createElement('div');
//     navIcon.className = 'nav-icon';

//     // Ajout des autres icônes à la barre de navigation
//     navIcon.appendChild(createSVG('bi bi-controller', 'M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1z'));
//     navIcon.appendChild(createSVG('bi bi-person-lines-fill', 'M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z'));
//     navIcon.appendChild(createSVG('bi bi-chat-dots-fill', 'M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2'));
//     navIcon.appendChild(createSVG('bi bi-gear-fill', 'M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z'));
//     // Ajout du container à la nav
//     container.appendChild(navIcon);

//     // Formulaire de recherche
//     const form = document.createElement('form');
//     form.className = 'd-flex';
//     form.setAttribute('role', 'search');

//     const input = document.createElement('input');
//     input.className = 'form-control me-2';
//     input.setAttribute('type', 'search');
//     input.setAttribute('placeholder', 'Username');
//     input.setAttribute('aria-label', 'Search');

//     const button = document.createElement('button');
//     button.className = 'btn btn-outline-success';
//     button.setAttribute('type', 'submit');

//     const searchSVG = createSVG('bi bi-search', 'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0');
//     button.appendChild(searchSVG.firstChild);

//     form.appendChild(input);
//     form.appendChild(button);
//     container.appendChild(form);

//     nav.appendChild(container);


//     // Ajout du contenu de base
//     const baseDiv = document.createElement('div');
//     baseDiv.className = 'base';

//     const title = document.createElement('h5');
//     title.className = 'title';
//     title.textContent = 'Welcome';
//     baseDiv.appendChild(title);

//     const contentContainer = document.createElement('div');
//     contentContainer.className = 'contener';

//     const cardBody = document.createElement('div');
//     cardBody.className = 'card-body';

//     const paragraph = document.createElement('p');
//     paragraph.textContent = 'This is our transcendence homepage. This project involves creating a website for the mighty Pong competition! We hope you enjoy your visit to our site.';
//     cardBody.appendChild(paragraph);

//     // Création des boutons
//     const ul = document.createElement('ul');

//     const li1 = document.createElement('li');
//     const signInLink = document.createElement('a');
//     signInLink.href = '#';
//     signInLink.className = 'btn btn-primary ButtonWelcome';
//     signInLink.textContent = 'Sign in';
//     li1.appendChild(signInLink);
//     ul.appendChild(li1);

//     const li2 = document.createElement('li');
//     const registerLink = document.createElement('a');
//     registerLink.href = '/register';
//     registerLink.className = 'btn btn-primary ButtonWelcome';
//     registerLink.textContent = 'Register';
//     li2.appendChild(registerLink);
//     ul.appendChild(li2);

//     cardBody.appendChild(ul);
//     contentContainer.appendChild(cardBody);

//     // Ajout de l'image
//     const image = document.createElement('img');
//     image.src = '/assets/pong.png';
//     image.className = 'object-fit-fill border rounded';
//     image.alt = '';
//     contentContainer.appendChild(image);

//     baseDiv.appendChild(contentContainer);

//     // Ajout de tout au corps du document
//     document.body.appendChild(nav);
//     document.body.appendChild(baseDiv);
// }

export function homeView(container) {
    container.innerHTML = '';

    // Creation d'une barre de navigation
    const nav = document.createElement('nav');
    nav.className = 'navbar fixed-top bg-body-tertiary';
    container.appendChild(nav);

    // Reecrire le code ci-dessus en utilisant du JS
    const containerFluid = document.createElement('div');
    containerFluid.className = 'container-fluid';
    nav.appendChild(containerFluid);

    const aHome = document.createElement('a');
    aHome.className = 'navbar-brand';
    containerFluid.appendChild(aHome);

    const svgHome = document.createElement('svg');
    svgHome.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgHome.setAttribute('width', '30');
    svgHome.setAttribute('height', '24');
    svgHome.setAttribute('fill', 'currentColor');
    svgHome.setAttribute('class', 'bi bi-house-door-fill');
    svgHome.setAttribute('viewBox', '0 0 16 16');
    aHome.appendChild(svgHome);

    const path = document.createElement('path');
    path.setAttribute('d', 'M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5');
    svgHome.appendChild(path);

    // Creation d'un div pour les icones
    const div = document.createElement('div');
    div.className = 'nav-icon';
    containerFluid.appendChild(div);

    // Creation des icones
    const aGame = document.createElement('a');
    aGame.className = 'navbar-brand';
    div.appendChild(aGame);

    const svgGame = document.createElement('svg');
    svgGame.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgGame.setAttribute('width', '30');
    svgGame.setAttribute('height', '24');
    svgGame.setAttribute('fill', 'currentColor');
    svgGame.setAttribute('class', 'bi bi-controller');
    svgGame.setAttribute('viewBox', '0 0 16 16');
    aGame.appendChild(svgGame);

    const path1 = document.createElement('path');
    path1.setAttribute('d', 'M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1z');
    svgGame.appendChild(path1);

    const path2 = document.createElement('path');
    path2.setAttribute('d', 'M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729q.211.136.373.297c.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466s.34 1.78.364 2.606c.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527s-2.496.723-3.224 1.527c-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.3 2.3 0 0 1 .433-.335l-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a14 14 0 0 0-.748 2.295 12.4 12.4 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.4 12.4 0 0 0-.339-2.406 14 14 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27s-2.063.091-2.913.27');
    svgGame.appendChild(path2);

    const aFriend = document.createElement('a');
    aFriend.className = 'navbar-brand';
    div.appendChild(aFriend);

    const svgFriend = document.createElement('svg');
    svgFriend.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgFriend.setAttribute('width', '30');
    svgFriend.setAttribute('height', '24');
    svgFriend.setAttribute('fill', 'currentColor');
    svgFriend.setAttribute('class', 'bi bi-person-lines-fill');
    svgFriend.setAttribute('viewBox', '0 0 16 16');
    aFriend.appendChild(svgFriend);

    const path3 = document.createElement('path');
    path3.setAttribute('d', 'M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z');
    svgFriend.appendChild(path3);

    const aChat = document.createElement('a');
    aChat.className = 'navbar-brand';
    div.appendChild(aChat);

    const svgChat = document.createElement('svg');
    svgChat.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgChat.setAttribute('width', '30');
    svgChat.setAttribute('height', '24');
    svgChat.setAttribute('fill', 'currentColor');
    svgChat.setAttribute('class', 'bi bi-chat-dots-fill');
    svgChat.setAttribute('viewBox', '0 0 16 16');
    aChat.appendChild(svgChat);

    const path4 = document.createElement('path');
    path4.setAttribute('d', 'M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2');
    svgChat.appendChild(path4);

    const aSettings = document.createElement('a');
    aSettings.className = 'navbar-brand';
    div.appendChild(aSettings);

    const svgSettings = document.createElement('svg');
    svgSettings.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgSettings.setAttribute('width', '30');
    svgSettings.setAttribute('height', '24');
    svgSettings.setAttribute('fill', 'currentColor');
    svgSettings.setAttribute('class', 'bi bi-gear-fill');
    svgSettings.setAttribute('viewBox', '0 0 16 16');
    aSettings.appendChild(svgSettings);

    const path5 = document.createElement('path');
    path5.setAttribute('d', 'M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z');
    svgSettings.appendChild(path5);

    // Creation d'un formulaire de recherche
    const form = document.createElement('form');
    form.className = 'd-flex';
    form.setAttribute('role', 'search');
    containerFluid.appendChild(form);

    const input = document.createElement('input');
    input.className = 'form-control me-2';
    input.setAttribute('type', 'search');
    input.setAttribute('placeholder', 'Username');
    input.setAttribute('aria-label', 'Search');
    form.appendChild(input);

    const button = document.createElement('button');
    button.className = 'btn btn-outline-success';
    button.setAttribute('type', 'submit');
    form.appendChild(button);

    const svgSearch = document.createElement('svg');
    svgSearch.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgSearch.setAttribute('width', '16');
    svgSearch.setAttribute('height', '16');
    svgSearch.setAttribute('fill', 'currentColor');
    svgSearch.setAttribute('class', 'bi bi-search');
    svgSearch.setAttribute('viewBox', '0 0 16 16');
    button.appendChild(svgSearch);

    const path6 = document.createElement('path');
    path6.setAttribute('d', 'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0');
    svgSearch.appendChild(path6);

    // Creation d'un div base
    const base = document.createElement('div');
    base.className = 'base';
    container.appendChild(base);

    const h5 = document.createElement('h5');
    h5.className = 'title';
    h5.textContent = 'Welcome';
    base.appendChild(h5);

    const divContener = document.createElement('div');
    divContener.className = 'contener';
    base.appendChild(divContener);

    const divCardBody = document.createElement('div');
    divCardBody.className = 'card-body';
    divContener.appendChild(divCardBody);

    const p = document.createElement('p');
    // p.className = 'card-text';
    p.textContent = 'This is our transcendence homepage. This project involves creating a website for the mighty Pong competition! We hope you enjoy your visit to our site.';
    divCardBody.appendChild(p);

    // Creation d'une liste de boutons
    const ul = document.createElement('ul');
    //ul.className = 'list-group list-group-horizontal';
    divCardBody.appendChild(ul);

    const liLogin = document.createElement('li');
    // liLogin.className = 'list-group-item';
    ul.appendChild(liLogin);

    const buttonLogin = document.createElement('button');
    buttonLogin.className = 'btn btn-primary';
    buttonLogin.textContent = 'Sign in';
    liLogin.appendChild(buttonLogin);

    const liRegister = document.createElement('li');
    // liRegister.className = 'list-group-item';
    ul.appendChild(liRegister);

    const buttonRegister = document.createElement('button');
    buttonRegister.className = 'btn btn-primary';
    buttonRegister.textContent = 'Register';
    liRegister.appendChild(buttonRegister);

    // Image de pong
    const img = document.createElement('img');
    img.setAttribute('src', '/assets/pong.png');
    img.setAttribute('alt', 'Pong');

    img.className = 'object-fit-fill border rounded';
    divContener.appendChild(img);
    // container.appendChild(img);
}
