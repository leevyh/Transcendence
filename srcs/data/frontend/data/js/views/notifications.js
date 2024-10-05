import { navigateTo } from '../app.js';
import { getCookie } from './utils.js';
import { displayFriendRequests } from '../component/notifications/friendRequestNotifications.js';
import { displayMessages } from '../component/notifications/newMessageNotifications.js';

export function notifications() {
    const notifications_div = document.createElement('div');
    notifications_div.className = 'notifications';

    const notifications_button = document.createElement('button');
    notifications_button.className = 'btn btn-primary notifications_button';
    notifications_button.setAttribute('type', 'button');
    notifications_button.setAttribute('data-bs-toggle', 'offcanvas');
    notifications_button.setAttribute('data-bs-target', '#offcanvasRight');
    notifications_button.setAttribute('aria-controls', 'offcanvasRight');

    //Get Notifications with status and count them. And create a badge only if there are notifications not read
    // const notifications = await getNotifications();

    const notifications = [
        {
            id: 1,
            type: 'friend_request',
            sender: {
                id: 1,
                username: 'test',
                profile_picture: 'test',
            },
            timestamp: '2021-09-01T12:00:00',
        },
        {
            id: 2,
            type: 'new_message',
            sender: {
                id: 1,
                username: 'test',
                profile_picture: 'test',
            },
            timestamp: '2021-09-01T12:00:00',
            // content big message to try truncating
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, velit nec auctor tincidunt, elit libero porttitor libero, nec fringilla metus arcu nec nulla',
        },
    ]

    // const notifications_count = notifications.length;
    // const notifications_count = notifications.length;
    // if (notifications_count > 0) {
    //     const notifications_badge = document.createElement('span');
    //     notifications_badge.className = 'badge badge_notifs bg-danger position-absolute top-0 end-0';
    //     notifications_badge.textContent = notifications_count;
    //     notifications_button.appendChild(notifications_badge);
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

    // const notifications = await getNotifications();
    // Do a notification example to see how it looks

    displayNotifications(notifications, offcanvas_body);

    offcanvas.appendChild(offcanvas_body);
    notifications_div.appendChild(offcanvas);

    return notifications_div;
}

function displayNotifications(notifications, offcanvas_body) {
    notifications.forEach(notification => {
        //Check if notifications are friend requests or new messages
        if (notification.type === 'friend_request') {
            displayFriendRequests(notification, offcanvas_body);
        } else if (notification.type === 'new_message') {
            displayMessages(notification, offcanvas_body);
        }
    });



    return offcanvas_body;
}