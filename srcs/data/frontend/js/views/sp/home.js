export function homeViewSP(container) {
    container.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = 'Página de inicio';

    const p = document.createElement('p');
    p.textContent = '¡Bienvenido a la página de inicio!';

    container.appendChild(h1);
    container.appendChild(p);
}