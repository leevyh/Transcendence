import { DEBUG, navigateTo } from '../app.js';

export function callback42(container) {
    container.innerHTML = '';

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        fetch('/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ code: code })
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                if (DEBUG) {console.log(data);}
                localStorage.setItem('token', data.token);
                navigateTo('/pong'); // TODO: a changer quand la page de profil sera créée
            }
            else {
                if (DEBUG) {console.log('No data');}
            }
        })
        .catch(error => {
            if (DEBUG) {console.error('Error:', error);}
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
            formLogin.insertBefore(errorMessage, buttonLogin42);
        });
    }
    else {
        if (DEBUG) {console.log('No code');}
    }
}
