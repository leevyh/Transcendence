export function registerView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create elements
    const h1 = document.createElement('h1');
    h1.textContent = 'Register';

    const form = document.createElement('form');

    // Username input
    const div1 = document.createElement('div');
    const label1 = document.createElement('label');
    label1.setAttribute('for', 'username');
    label1.textContent = 'Username:';
    const input1 = document.createElement('input');
    input1.setAttribute('type', 'text');
    input1.setAttribute('id', 'username');
    input1.setAttribute('name', 'username');
    div1.appendChild(label1);
    div1.appendChild(input1);

    // Nickname input
    const div4 = document.createElement('div');
    const label4 = document.createElement('label');
    label4.setAttribute('for', 'nickname');
    label4.textContent = 'Nickname:';
    const input4 = document.createElement('input');
    input4.setAttribute('type', 'text');
    input4.setAttribute('id', 'nickname');
    input4.setAttribute('name', 'nickname');
    div4.appendChild(label4);
    div4.appendChild(input4);

    // Email input
    const div5 = document.createElement('div');
    const label5 = document.createElement('label');
    label5.setAttribute('for', 'email');
    label5.textContent = 'Email:';
    const input5 = document.createElement('input');
    input5.setAttribute('type', 'email');
    input5.setAttribute('id', 'email');
    input5.setAttribute('name', 'email');
    div5.appendChild(label5);
    div5.appendChild(input5);

    // Password input
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

    // Confirm Password input
    const div3 = document.createElement('div');
    const label3 = document.createElement('label');
    label3.setAttribute('for', 'confirm_password');
    label3.textContent = 'Confirm Password:';
    const input3 = document.createElement('input');
    input3.setAttribute('type', 'password');
    input3.setAttribute('id', 'confirm_password');
    input3.setAttribute('name', 'confirm_password');
    div3.appendChild(label3);
    div3.appendChild(input3);

    // Submit button
    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.textContent = 'Register';

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = input1.value;
        const password = input2.value;
        const confirmPassword = input3.value;
        const nickname = input4.value;
        const email = input5.value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Include CSRF token if needed
            },
            body: JSON.stringify(
                {
                    username: username,
                    password: password,
                    nickname: nickname,
                    email: email
                }
            )
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.message === 'User registered successfully') {
                    alert('Registration successful!');
                    window.location.href = '/login'; // Redirect to login page
                } else if (data.errors) {
                    alert('Registration failed: ' + JSON.stringify(data.errors));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    });

    form.appendChild(div1);
    form.appendChild(div4);
    form.appendChild(div5);
    form.appendChild(div2);
    form.appendChild(div3);
    form.appendChild(button);

    container.appendChild(h1);
    container.appendChild(form);
}

// Helper function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}