export function homeViewEN(container) {
    container.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = 'Home';

    const p = document.createElement('p');
    p.textContent = 'Welcome to the Home page!';

    container.appendChild(h1);
    container.appendChild(p);
}