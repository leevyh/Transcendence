export function displayFriends(friends) {
    const divListFriends = document.querySelector('.divListFriends');
    divListFriends.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'list-unstyled d-flex flex-column friends_ul';

    friends = friends.sort((a, b) => {
        return (a.status === 'online' ? -1 : 1) - (b.status === 'online' ? -1 : 1);
    });

    divListFriends.appendChild(ul);

    friends.forEach(friend => {
        const ul = document.querySelector('.friends_ul');
        const li = document.createElement('li');
        li.className = 'friendItem';
        const cardFriend = document.createElement('div');
        cardFriend.className = 'card d-flex flex-row align-items-center p-2 shadow-sm';

        const avatarFriend = document.createElement('img');
        avatarFriend.src = `data:image/png;base64,${friend.avatar}`;
        avatarFriend.className = 'avatarFriend rounded-circle';
        avatarFriend.alt = 'Friend Avatar';
        cardFriend.appendChild(avatarFriend);

        const infoFriend = document.createElement('div');
        infoFriend.className = 'ms-3';

        const nicknameFriend = document.createElement('span');
        nicknameFriend.className = 'friend-name mb-1';
        nicknameFriend.textContent = friend.nickname;
        infoFriend.appendChild(nicknameFriend);

        const statusFriend = document.createElement('small');
        statusFriend.className = 'friends_status';
        statusFriend.textContent = friend.status;
        infoFriend.appendChild(statusFriend);

        cardFriend.appendChild(infoFriend);
        li.appendChild(cardFriend);
        ul.appendChild(li);
    });
}

export function addNewFriend(user_id, nickname, status, avatar) {
    const ul = document.querySelector('.friends_ul');
    const li = document.createElement('li');
    li.className = 'friendItem';
    const cardFriend = document.createElement('div');
    cardFriend.className = 'card d-flex flex-row align-items-center p-2 shadow-sm';

    const avatarFriend = document.createElement('img');
    avatarFriend.src = `data:image/png;base64,${avatar}`;
    avatarFriend.className = 'avatarFriend rounded-circle';
    avatarFriend.alt = 'Friend Avatar';
    cardFriend.appendChild(avatarFriend);

    const infoFriend = document.createElement('div');
    infoFriend.className = 'ms-3';

    const nicknameFriend = document.createElement('span');
    nicknameFriend.className = 'friend-name mb-1';
    nicknameFriend.textContent = nickname;
    infoFriend.appendChild(nicknameFriend);

    const statusFriend = document.createElement('small');
    statusFriend.className = 'friends_status';
    statusFriend.textContent = status;
    infoFriend.appendChild(statusFriend);

    cardFriend.appendChild(infoFriend);
    li.appendChild(cardFriend);
    ul.appendChild(li);
}

export function updateFriendStatus(user_id, nickname, status) {
    const friendItems = document.querySelectorAll('.friendItem');
    friendItems.forEach(item => {
        const nameElement = item.querySelector('.friend-name');
        if (nameElement && nameElement.textContent === nickname) {
            const statusElement = item.querySelector('.friends_status');
            if (statusElement) statusElement.textContent = status;
        }
    });
}