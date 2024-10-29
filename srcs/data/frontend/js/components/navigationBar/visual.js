import { createAvatarDiv } from './avatar.js';
import { createModalInfo } from './modalInfos.js';
import { createModalSettings } from './modalSettings.js';
import { createNavButton, openModal } from './utils.js';
import { navigateTo } from '../../app.js';
import { getCookie } from '../../views/utils.js';

// Creation of the navigation bar component
export async function createNavigationBar(container, userData) {
    const nav = document.createElement('nav');
    nav.className = 'nav d-flex flex-column justify-content-start align-items-center shadow-lg';
    nav.style.backgroundColor = '#435574';

    const divProfile = document.createElement('div');
    divProfile.className = 'divProfile w-50 text-center';
    nav.appendChild(divProfile);

    const avatarDiv = await createAvatarDiv(container, userData);
    divProfile.appendChild(avatarDiv);

    const TitleNickname = await createTitleNickname(userData);
    divProfile.appendChild(TitleNickname);

    // Navigation list
    const divNav = document.createElement('div');
    divNav.className = 'divNav border-top border-2 border-bottom border-custom-color py-3 w-100 hide-on-short';
    nav.appendChild(divNav);

    const NavBarList = createNavBarList();
    divNav.appendChild(NavBarList);

    // Friends list
    const divListFriends = document.createElement('div');
    divListFriends.className = 'divListFriends d-flex justify-content-center w-100 py-3 hide-on-short';
    // divListFriends.textContent = 'Friends list';
    nav.appendChild(divListFriends);

    const logoutButton = createLogoutButton();
    nav.appendChild(logoutButton);

    // Create modals for the navigation bar
    const modalInfo = await createModalInfo(userData);
    container.appendChild(modalInfo); // Direclty in the container to avoid positioning issues

    const modalSettings = await createModalSettings(userData);
    container.appendChild(modalSettings); // Direclty in the container to avoid positioning issues

    return nav;
}

async function createTitleNickname(userData) {
    const TitleNickname = document.createElement('h4');
    TitleNickname.className = 'TitleNickname mt-2 pb-4';
    TitleNickname.textContent = `${userData.nickname}`;
    TitleNickname.setAttribute('role', 'button'); // To make the element clickable
    TitleNickname.setAttribute('tabindex', '0'); // To make the element focusable

    // Add event listener for keyboard accessibility
    TitleNickname.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            openModal(document.getElementById('modalInfo'));
        }
    });

    // Add event listener for mouse click
    TitleNickname.addEventListener('click', () => {
        openModal(document.getElementById('modalInfo'));
    });

    return TitleNickname;
}


function createNavBarList() {
    const navBarList = document.createElement('ul');
    navBarList.className = 'navBarList list-unstyled d-flex flex-column';

    navBarList.appendChild(createNavButton('Pong', () => navigateTo('/menuPong')));
    navBarList.appendChild(createNavButton('Chat', () => navigateTo('/chat')));
    navBarList.appendChild(createNavButton('Users', () => navigateTo('/users')));
    navBarList.appendChild(createNavButton('Leaderboard', () => navigateTo('/leaderboard')));

    return navBarList;
}

function createLogoutButton() {
    const logoutButton = document.createElement('button');
    logoutButton.className = 'buttonLogOut btn btn-danger shadow-lg mt-auto';
    logoutButton.textContent = 'Logout'

    // Event listener for logout button (visual effects)
    logoutButton.addEventListener('mousedown', () => {
        logoutButton.classList.add('c82333');
    });

    logoutButton.addEventListener('mouseup', () => {
        logoutButton.classList.remove('btn-dark');
    });

    // Event listener for logout button (logout)
    logoutButton.addEventListener('click', () => {
        fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => response.json())
        .then(data => {
            localStorage.removeItem('token');
            navigateTo('/');
        });
    });

    return logoutButton;
}
