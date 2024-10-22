export function displayMessages(notification, offcanvas_body) {
    const notification_type_div = document.createElement('div');
    notification_type_div.className = `notification_type_notification_${notification.type} d-flex flex-column gap-2`;

    const notification_type_header = document.createElement('div');
    notification_type_header.className = 'd-flex gap-2';

    const notification_type_img = document.createElement('img');
    notification_type_img.className = 'rounded-circle img-fluid';
    notification_type_img.src = `data:image/png;base64,${notification.from_avatar}`;
    notification_type_img.alt = 'profile_picture';
    notification_type_img.width = '50';
    notification_type_img.height = '50';
    notification_type_header.appendChild(notification_type_img);

    const notification_type_header_text = document.createElement('div');
    notification_type_header_text.className = 'd-flex flex-column';

    const notification_type_header_text_type = document.createElement('span');
    notification_type_header_text_type.textContent = 'New Message from ' + notification.from_nickname;

    const notification_type_header_text_time = document.createElement('span');
    notification_type_header_text_time.textContent = notification.timestamp;
    notification_type_header_text_time.className = 'text-muted time_notif_span';

    notification_type_header_text.appendChild(notification_type_header_text_type);
    notification_type_header_text.appendChild(notification_type_header_text_time);
    notification_type_header.appendChild(notification_type_header_text);

    const notification_type_close_button = document.createElement('button');
    notification_type_close_button.className = 'btn-close ms-auto';
    notification_type_close_button.setAttribute('aria-label', 'Close');
    // remove the div of the notification and delete it from the database
    notification_type_close_button.onclick = async function() {
        //             await deleteNotification(notification.id);
        let hr = notification_type_div.nextElementSibling;
        hr.remove();
        notification_type_div.remove();

    };
    notification_type_header.appendChild(notification_type_close_button);
    notification_type_div.appendChild(notification_type_header);

    const notification_type_body = document.createElement('div');
    notification_type_body.className = 'd-flex flex-column text_truncate_container notif_container';

    const notification_type_body_content = document.createElement('span');
    notification_type_body_content.textContent = `${notification.message}`;
    notification_type_body_content.className = 'p-1';
    notification_type_body.appendChild(notification_type_body_content);


    notification_type_div.appendChild(notification_type_body);
    offcanvas_body.appendChild(notification_type_div);
    const line = document.createElement('hr');
    line.className = 'w-100 separator_line_notifs';
    offcanvas_body.appendChild(line);

}