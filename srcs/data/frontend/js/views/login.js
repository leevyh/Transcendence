// views/login.js
export function loginView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Create elements
    const h1 = document.createElement('h1');
    h1.textContent = 'Login';

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
                'X-CSRFToken': getCookie('csrftoken') // Include CSRF token if needed
            },
            body: JSON.stringify({ login: username, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User logged in successfully') {
                localStorage.setItem('username', username);
                localStorage.setItem('isLoggedIn', 'true');
                // Redirect to profile page
                window.location.hash = '#profile';
                // window.location.hash = '#profile/' + username;
                
            } else if (data.error) {
                alert(data.error);
                // Redirect to register page or any other page
                window.location.hash = '#register';
                
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


// export function loginView(container) {
//     // Clear previous content
//     container.innerHTML = '';

//     // Create and append the form element
//     const form = document.createElement('form');
//     form.className = 'form-register';

//     // Create and append the h1 element
//     const h1 = document.createElement('h1');
//     h1.className = 'h3 mb-3 font-weight-normal';
//     h1.setAttribute('data-i18n', 'register');
//     h1.textContent = 'Please register';
//     form.appendChild(h1);

//     // Create and append the email input element
//     const inputEmail = document.createElement('input');
//     inputEmail.type = 'email';
//     inputEmail.id = 'inputEmail';
//     inputEmail.className = 'form-control';
//     inputEmail.placeholder = 'Email address';
//     inputEmail.required = true;
//     inputEmail.autofocus = true;
//     form.appendChild(inputEmail);

//     // Create and append the password input element
//     const inputPassword = document.createElement('input');
//     inputPassword.type = 'password';
//     inputPassword.id = 'inputPassword';
//     inputPassword.className = 'form-control';
//     inputPassword.placeholder = 'Password';
//     inputPassword.required = true;
//     form.appendChild(inputPassword);

//     // Confirm password input element
//     const inputConfirmPassword = document.createElement('input');
//     inputConfirmPassword.type = 'password';
//     inputConfirmPassword.id = 'inputConfirmPassword';
//     inputConfirmPassword.className = 'form-control';
//     inputConfirmPassword.placeholder = 'Confirm Password';
//     inputConfirmPassword.required = true;
//     form.appendChild(inputConfirmPassword);
    
//     // Create and append the checkbox div
//     const checkboxDiv = document.createElement('div');
//     checkboxDiv.className = 'checkbox mb-3';
//     const checkboxLabel = document.createElement('label');
//     const checkboxInput = document.createElement('input');
//     checkboxInput.type = 'checkbox';
//     checkboxInput.value = 'remember-me';
//     checkboxLabel.appendChild(checkboxInput);
//     checkboxLabel.appendChild(document.createTextNode(' Remember me'));
//     checkboxDiv.appendChild(checkboxLabel);
//     form.appendChild(checkboxDiv);

//     // Create and append the login div
//     const loginDiv = document.createElement('div');
//     loginDiv.id = 'login';

//     // Create and append the "Sign in" button
//     const signInButton = document.createElement('button');
//     signInButton.type = 'button';
//     signInButton.className = 'btn btn-outline-primary';
//     signInButton.setAttribute('data-i18n', 'sign');
//     signInButton.textContent = 'Sign in';
//     loginDiv.appendChild(signInButton);

//     // Create and append the "Sign in with 42" button
//     const signIn42Button = document.createElement('button');
//     signIn42Button.type = 'button';
//     signIn42Button.className = 'btn btn-dark';
//     signIn42Button.setAttribute('data-i18n', 'sign42');
//     signIn42Button.innerHTML = 'Sign in with <img class="logo42" src="./js/img/42_logo_white.svg">';
//     loginDiv.appendChild(signIn42Button);

//     form.appendChild(loginDiv);

//     // Append the form to the container
//     container.appendChild(form);
// }