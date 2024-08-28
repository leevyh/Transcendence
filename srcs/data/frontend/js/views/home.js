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
//     container.appendChild(h1);
//     container.appendChild(p);
//     // container.appendChild(button);

//     // TEST KARL
//     const h3 = document.createElement('h3');
//     h3.textContent = 'KARL';
//     container.appendChild(h3);
//     // FIN TEST KARL
// }

export function homeView()
{
    return `
        <div class="contener">
                <div class="card-body">
                    <h5 class="title">Welcome</h5>
                    <p>This is our home page</p>
                    <ul>
                        <li>
                            <a href="#" class="btn btn-primary" class="ButtonWelcome">Sing in</a>
                        </li>
                        <li>
                            <a href="/register" class="btn btn-primary" class="ButtonWelcome">Register</a>
                        </li>
                    </ul>

                </div>
            <img src="/assets/pong.png" class="object-fit-fill border rounded" alt="">
        <div/>
    `;
}
///insert <nav> = mettre png d'une maison et mettre le lien dans la maison
