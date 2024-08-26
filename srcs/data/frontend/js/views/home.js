// import { navigateTo } from './utils.js';

export function homeView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create elements
    const h1 = document.createElement('h1');
    h1.textContent = 'Home';

    const p = document.createElement('p');
    p.textContent = 'Welcome to the Home page!';

    // Create button to go to login page
    // const button = document.createElement('button');
    // button.textContent = 'Go to Login';
    // button.addEventListener('click', function() {
    //     navigateTo('/login');
    // });

    // Append elements to container
    container.appendChild(h1);
    container.appendChild(p);
    // container.appendChild(button);
}