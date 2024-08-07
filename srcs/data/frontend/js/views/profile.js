export function profileView(container) {
    // Clear previous content
    container.innerHTML = '';

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('username');
    if (isLoggedIn) {
        // Get user data

               // // Recuperer les infos de l'utilisateur dans le backend
        fetch(`api/settings/${user}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => response.json())
        .then(data => {

            // get user data
            console.log(data);
            const userData = {
                nickname: data.nickname,
                email: data.email,
                language: data.language,
                accessibility: data.accessibility,
                theme: data.dark_mode,
                avatar: data.avatar,
                // avatar: data.avatar,
            };

            // Create and append profile elements
            const h1 = document.createElement('h1');
            h1.textContent = 'Profile';
            const pUsername = document.createElement('p');
            pUsername.textContent = `Username: ${userData.nickname}`;
            const pEmail = document.createElement('p');
            pEmail.textContent = `Email: ${userData.email}`;
            const pLanguage = document.createElement('p');
            pLanguage.textContent = `Language: ${userData.language}`;
            const pAccessibility = document.createElement('p');
            pAccessibility.textContent = `Accessibility: ${userData.accessibility}`;
            const pTheme = document.createElement('p');
            pTheme.textContent = `Theme: ${userData.theme}`;
            const imgAvatar = document.createElement('img');
            imgAvatar.src = userData.avatar;

            // const imgAvatar = document.createElement('img');
            // imgAvatar.src = userData.avatar;


            // Append elements to container
            container.appendChild(h1);
            container.appendChild(pUsername);
            container.appendChild(pEmail);
            container.appendChild(pLanguage);
            container.appendChild(pAccessibility);
            container.appendChild(pTheme);
            container.appendChild(imgAvatar);

            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Logout';
            logoutButton.className = 'btn btn-danger';
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                window.location.hash = '#login';
            });

            container.appendChild(logoutButton);

        });


        // const userData = {
        //     username: localStorage.getItem('username') || 'Unknown',
        //     email: localStorage.getItem('email') || 'Unknown',
        //     nickname: localStorage.getItem('nickname') || 'Unknown',

        // };


        // // Create and append profile elements
        // const h1 = document.createElement('h1');
        // h1.textContent = 'Profile';

        // const pUsername = document.createElement('p');
        // pUsername.textContent = `Username: ${userData.username}`;

        // const pEmail = document.createElement('p');
        // pEmail.textContent = `Email: ${userData.email}`;

        // const pFirstName = document.createElement('p');
        // pFirstName.textContent = `First Name: ${userData.firstName}`;

        // const pLastName = document.createElement('p');
        // pLastName.textContent = `Last Name: ${userData.lastName}`;

        // // Append elements to container
        // container.appendChild(h1);
        // container.appendChild(pUsername);
        // container.appendChild(pEmail);
        // container.appendChild(pFirstName);
        // container.appendChild(pLastName);

        // Create and append logout button

    } else {
        // If not logged in, redirect to login or show a message
        const p1 = document.createElement('p');
        p1.textContent = 'You are not logged in. Please log in to view your profile.';

        const loginButton = document.createElement('button');
        loginButton.textContent = 'Go to Login';
        loginButton.className = 'btn btn-primary';
        loginButton.addEventListener('click', () => {
            window.location.hash = '#login';
        });

        container.appendChild(p1);
        container.appendChild(loginButton);
    }
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