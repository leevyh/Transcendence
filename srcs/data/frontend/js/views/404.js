// export function ErrorView(container) {
//     // Clear previous content
//     container.innerHTML = '';

//     // Create elements
//     const h1 = document.createElement('h1');
//     h1.textContent = 'Oops !';

//     const p = document.createElement('p');
//     p.textContent = 'Error #404: Page not found.';

//     // Append elements to container
//     container.appendChild(h1);
//     container.appendChild(p);
// }


export function notFoundView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create and append 404 elements
    const h1 = document.createElement('h1');
    h1.textContent = '404 - Page Not Found';

    const p = document.createElement('p');
    p.textContent = 'The page you are looking for does not exist.';

    const homeButton = document.createElement('button');
    homeButton.textContent = 'Go to Home';
    homeButton.className = 'btn btn-primary';
    homeButton.addEventListener('click', () => {
        window.location.hash = '#home';
    });

    container.appendChild(h1);
    container.appendChild(p);
    container.appendChild(homeButton);
}