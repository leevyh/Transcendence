import { getCookie } from './utils.js';
import { displayFriendRequests } from '../components/notifications/friendRequestNotifications.js';
import { displayMessages } from '../components/notifications/newMessageNotifications.js';
import wsManager from "./wsManager.js";
import { displayToast} from "./utils.js";
import { DEBUG } from '../app.js';

let isNotificationWSInitialized = false;

async function getNotificationsWS() {

    if (isNotificationWSInitialized) {
        if (DEBUG) console.log('WSManager WebSocket already initialized');
        return;
    }

    isNotificationWSInitialized = true;

    if (DEBUG) console.log('Initialization of getNotificationsWS');

    // Create a WebSocketManager instance
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
        if (DEBUG) console.error("Error while getting unread notifications");
        return [];
    }
    return await response.json();
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
        if (DEBUG) console.error("Error while getting notifications");
        return [];
    }
    // if (DEBUG) console.log("Notifications", await response.json());
    return await response.json();
}


function incrementNotificationCount() {
    const badge = document.querySelector('.badge_notifs');
    let count = parseInt(badge.textContent) || 0;
    count += 1;
    badge.textContent = count;
    badge.style.display = 'inline-block';
}

export function decrementNotificationCount() {
    const badge = document.querySelector('.badge_notifs');
    let count = parseInt(badge.textContent) || 0;
    count -= 1;
    if (count <= 0) {
        badge.textContent = 0;
        badge.style.display = 'none';
    } else {
        badge.textContent = count;
    }
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
    notifications_button.setAttribute('role', 'button'); // Make it focusable for accessibility
    notifications_button.setAttribute('tabindex', '0'); // Make it focusable for accessibility

    // Get Notifications with status and count them. And create a badge only if there are notifications not read
    const unread_notification = await getUnreadNotifications();
    if (DEBUG) console.log("Unread notifications", unread_notification);

    // Set the aria-label attribute to inform the user about the number of unread notifications
    notifications_button.setAttribute('aria-label', unread_notification.length > 0 
        ? `You have ${unread_notification.length} unread notifications` 
        : 'You have no unread notifications');

    const notifications_badge = document.createElement('span');
    notifications_badge.className = 'badge badge_notifs bg-danger position-absolute top-0 end-0';

    // Display or hide the badge depending on the number of unread notifications
    if (unread_notification.length > 0) {
        notifications_badge.textContent = unread_notification.length;
        notifications_badge.style.display = 'inline-block'; // Display the badge if there are unread notifications
    } else {
        notifications_badge.style.display = 'none'; // Hide the badge if there are no notifications
    }
    notifications_button.appendChild(notifications_badge);

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

    let notifications = await getNotifications();

    notifications.forEach(notification => {
        displayNotifications(notification, offcanvas_body);
    });

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

export async function readNotification(notification_id) {
    const response = await fetch(`/api/notification/read_notification/${notification_id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        if (DEBUG) {console.error("Error while reading notification");}
    }
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
        if (DEBUG) {console.error("Error while reading all notifications");}
    }
    else
    {
        const badge = document.querySelector('.badge_notifs');
        if (badge) {
            badge.textContent = 0;
            badge.style.display = 'none'; // Hide the badge if there are no notifications
        }
    }
}

let notificationsArray = [];

function displayNotifications(notification, offcanvas_body) {
    //check if the notification is already in the notificationsArray by the id
    if (!notificationsArray.find(notif => notif.id === notification.id)) {
        notificationsArray.push(notification);
    }
    if (DEBUG) {console.log(notificationsArray);}

    // Sort notification by order
    notificationsArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    offcanvas_body.innerHTML = '';

    // Display sort notification
    notificationsArray.forEach(notification => {
        if (notification.type === 'friend_request') {
            displayFriendRequests(notification, offcanvas_body);
        } else if (notification.type === 'new_message') {
            displayMessages(notification, offcanvas_body);
        }
    });

    return offcanvas_body;
}

export function removeNotification(notificationId) {
    notificationsArray = notificationsArray.filter(notification => notification.id !== notificationId);
    //remove notification from the notificationsArray
    notificationsArray.pop();

    if (DEBUG) {console.log(notificationsArray);}
    const notification = document.getElementById(`notification_${notificationId}`);
    if (notification !== null) {

        notification.remove();
        // delete notification from the database but remove notification_ before the id
        deleteNotification(notificationId).then( () => {
            return;
        })
        .catch( (error) => {
            displayToast('Error while deleting notification', 'bg-danger');
            if (DEBUG) {console.error(error);}
        });
    }

    // notification.remove();
}

async function deleteNotification(notificationId) {

    const response = await fetch(`/api/notification/delete_notification/${notificationId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) {
        if (DEBUG) {console.error("Error while deleting notification");}
    }

}