import { navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { displayFriendRequests } from '../components/notifications/friendRequestNotifications.js';
import { displayMessages } from '../components/notifications/newMessageNotifications.js';
// import { getNotifications } from "../components/notifications/getNotifications";
import wsManager from "./wsManager.js";
import { displayToast} from "./utils.js";


async function getNotificationsWS() {

    wsManager.AddNotificationListener(
        function(data) {
            displayNotifications(data, document.querySelector('.offcanvas-body'));
            if (data.type === 'new_message' || data.type === 'friend_request') {
                incrementNotificationCount();
            }
        });
}

async function getUnreadNotifications() {
    const response = await fetch('/api/notifications/unread', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        console.error("Erreur lors de la récupération des notifications non lues");
        return [];
    }
    return await response.json(); // Assurez-vous que le backend renvoie un tableau
}


async function getNotifications() {
    const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        console.error("Erreur lors de la récupération des notifications");
        return [];
    }
    //call displayNotifications function for each notification in the response
    return await response.json();
}


function incrementNotificationCount() {
    const badge = document.querySelector('.badge_notifs');
    let count = parseInt(badge.textContent) || 0;
    count += 1;
    badge.textContent = count;
    badge.style.display = 'inline-block';
}


export async function notifications() {
    const notifications_div = document.createElement('div');
    notifications_div.className = 'notifications';

    const notifications_button = document.createElement('button');
    notifications_button.className = 'btn btn-primary notifications_button';
    notifications_button.setAttribute('type', 'button');
    notifications_button.setAttribute('data-bs-toggle', 'offcanvas');
    notifications_button.setAttribute('data-bs-target', '#offcanvasRight');
    notifications_button.setAttribute('aria-controls', 'offcanvasRight');

    // Get Notifications with status and count them. And create a badge only if there are notifications not read
    const unread_notification = await getUnreadNotifications();


    const notifications_badge = document.createElement('span');
    notifications_badge.className = 'badge badge_notifs bg-danger position-absolute top-0 end-0';
    if (unread_notification.length > 0) {
        notifications_badge.textContent = unread_notification.length;
        notifications_badge.style.display = 'inline-block'; // Afficher le badge
    } else {
        notifications_badge.style.display = 'none'; // Masquer le badge s'il n'y a pas de notifications
    }
    notifications_button.appendChild(notifications_badge);

    // Uncomment and modify this part if you want to display the count of unread notifications
    // if (unread_notification.count > 0) {
    //     notifications_badge.textContent = unread_notification.count;
    //     notifications_badge.style.display = 'block';
    // }

    const notifications_icon = document.createElement('i');
    notifications_icon.className = 'bi bi-bell-fill bell_notifs';
    notifications_button.appendChild(notifications_icon);
    notifications_div.appendChild(notifications_button);

    const offcanvas = document.createElement('div');
    offcanvas.className = 'offcanvas offcanvas-end rounded-3 notif_canvas';
    offcanvas.setAttribute('tabindex', '-1');
    offcanvas.setAttribute('id', 'offcanvasRight');
    offcanvas.setAttribute('aria-labelledby', 'offcanvasRightLabel');

    const offcanvas_header = document.createElement('div');
    offcanvas_header.className = 'offcanvas-header header_notifications';

    const offcanvas_title = document.createElement('h5');
    offcanvas_title.id = 'offcanvasRightLabel';
    offcanvas_title.textContent = 'Notifications';
    offcanvas_header.appendChild(offcanvas_title);

    const offcanvas_button = document.createElement('button');
    offcanvas_button.className = 'btn-close text-reset';
    offcanvas_button.setAttribute('data-bs-dismiss', 'offcanvas');
    offcanvas_button.setAttribute('aria-label', 'Close');
    offcanvas_header.appendChild(offcanvas_button);

    offcanvas.appendChild(offcanvas_header);

    const offcanvas_body = document.createElement('div');
    offcanvas_body.className = 'offcanvas-body d-flex flex-column body_notifications';

    // Populate notifications content
    let notifications = await getNotifications();

    notifications.forEach(notification => {
        displayNotifications(notification, offcanvas_body);
    });
    // displayNotifications(unread_notification, offcanvas_body);

    offcanvas.appendChild(offcanvas_body);
    notifications_div.appendChild(offcanvas);

    // Add event listeners for showing and hiding the offcanvas
    offcanvas.addEventListener('show.bs.offcanvas', async function () {
        document.body.classList.add('offcanvas-active');
        await readAllNotifications();
    });

    offcanvas.addEventListener('hidden.bs.offcanvas', function () {
        document.body.classList.remove('offcanvas-active');
    });


    await getNotificationsWS();
    return notifications_div;
}

async function readAllNotifications() {
    const response = await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        console.error("Erreur lors de la lecture des notifications");
    }
    else
    {
        const badge = document.querySelector('.badge_notifs');
        if (badge) {
            badge.textContent = 0;
            badge.style.display = 'none'; // Masquer le badge après avoir réinitialisé à 0
        }
    }
}

function displayNotifications(notifications, offcanvas_body) {
    // offcanvas_body.innerHTML = '';
    console.log(notifications);
    if (!notifications) {
        const no_notifications = document.createElement('p');
        no_notifications.textContent = 'No notifications';
        offcanvas_body.appendChild(no_notifications);
        return offcanvas_body;
    }

    if (notifications.type === 'friend_request') {
        displayFriendRequests(notifications, offcanvas_body);
    } else if (notifications.type === 'new_message') {
        displayMessages(notifications, offcanvas_body);
    }
    else {
        console.log("Do nothing");
    }

    return offcanvas_body;
}