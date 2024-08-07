import { getCookie } from './utils.js';

export function loginView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create elements
    const h1 = document.createElement('h1');
    h1.textContent = 'Login';

    //if already logged in, redirect to setting page
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = '/settings';
    }

    const form = document.createElement('form');

    const div1 = document.createElement('div');
    const label1 = document.createElement('label');
    label1.setAttribute('for', 'username');
    label1.textContent = 'Username:';
    const input1 = document.createElement('input');
    input1.setAttribute('type', 'text');
    input1.setAttribute('id', 'username');
    input1.setAttribute('name', 'username');

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        input1.value = storedUsername;
    }

    div1.appendChild(label1);
    div1.appendChild(input1);

    const div2 = document.createElement('div');
    const label2 = document.createElement('label');
    label2.setAttribute('for', 'password');
    label2.textContent = 'Password:';
    const input2 = document.createElement('input');
    input2.setAttribute('type', 'password');
    input2.setAttribute('id', 'password');
    input2.setAttribute('name', 'password');
    div2.appendChild(label2);
    div2.appendChild(input2);

    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.textContent = 'Login';

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = input1.value;
        const password = input2.value;

        fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ login: username, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User logged in successfully') {
                localStorage.setItem('username', username);
                localStorage.setItem('isLoggedIn', 'true');  // A supprimer plus tard pour eviter conflic avec le backend
                // Redirect to profile page
                window.location.href = '/settings';
                
            } else if (data.error) {
                alert(data.error);
                // Redirect to register page
                window.location.href = '/register';
                
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });

    form.appendChild(div1);
    form.appendChild(div2);
    form.appendChild(button);

    container.appendChild(h1);
    container.appendChild(form);
}