import { navigationBar } from './navigation.js';
// import { notifications } from './notifications.js';


export async function leaderboardView(container) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navBarContainer = await navigationBar(container);
    div.appendChild(navBarContainer);

    const mainDiv = document.createElement('div');
    mainDiv.className = 'd-flex flex-grow-1 m-4';
    div.appendChild(mainDiv);

    const viewContainer = document.createElement('div');
    div.appendChild(viewContainer);


    // const notifications_div = await notifications();
    // div.appendChild(notifications_div);
}
