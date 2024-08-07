export function homeView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create elements
    const h1 = document.createElement('h1');
    h1.textContent = 'Home';

    const p = document.createElement('p');
    p.textContent = 'Welcome to the Home page!';

    // Append elements to container
    container.appendChild(h1);
    container.appendChild(p);
}