import { navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { displayFriendRequests } from '../component/notifications/friendRequestNotifications.js';
import { displayMessages } from '../component/notifications/newMessageNotifications.js';
// import { getNotifications } from "../component/notifications/getNotifications";
import wsManager from "./wsManager.js";


async function getNotificationsWS() {

    wsManager.AddNotificationListener(
        function(data) {
            displayNotifications(data, document.querySelector('.offcanvas-body'));
            incrementNotificationCount();
        });
}

//TODO GET ALL NOTIFICATIONS WHEN THE PAGE IS LOADED + GET NOTIFICATIONS UNREAD WHEN THE PAGE IS LOADED AND DISPLAY NB OF NOTIFICATIONS DON'T READ

function incrementNotificationCount() {
    const badge = document.querySelector('.badge_notifs');
    console.log('alo');
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

    //Get Notifications with status and count them. And create a badge only if there are notifications not read
    const unread_notification = await getNotificationsWS();

    console.log('unread_notification', unread_notification);
    const notifications_badge = document.createElement('span');
    notifications_badge.className = 'badge badge_notifs bg-danger position-absolute top-0 end-0';
    notifications_badge.style.display = 'none';
    notifications_badge.textContent = '0';
    notifications_button.appendChild(notifications_badge);

    // if (notifications_count > 0) {
    //     notifications_badge.textContent = notifications_count;
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


    displayNotifications(notifications, offcanvas_body);

    offcanvas.appendChild(offcanvas_body);
    notifications_div.appendChild(offcanvas);

    return notifications_div;
}

function displayNotifications(notifications, offcanvas_body) {
    offcanvas_body.innerHTML = '';
    console.log(notifications);
    if (!notifications) {
        const no_notifications = document.createElement('p');
        no_notifications.textContent = 'No notifications';
        offcanvas_body.appendChild(no_notifications);
        return offcanvas_body;
    }

        //Check if notifications are friend requests or new messages
    if (notifications.type === 'friend_request') {
        displayFriendRequests(notifications, offcanvas_body);
    } else if (notifications.type === 'new_message') {
        displayMessages(notifications, offcanvas_body);
    }

    return offcanvas_body;
}