export function displayFriends(friends) {
    console.log('friends', friends);
    const divListFriends = document.querySelector('.divListFriends');
    divListFriends.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'list-unstyled d-flex flex-column friends_ul';

    // Sort friends by status and if all are offline or online, sort by nickname

    // friends.sort((a, b) => {
    //     if (a.status === b.status) {
    //         return a.nickname.localeCompare(b.nickname); TODO : CHECK IF IT WORKS
    //     }
    //     return a.status.localeCompare(b.status);
    // });

    friends = friends.sort((a, b) => {
        if (a.status === 'online' && b.status !== 'online') {
            return -1;
        } else if (a.status !== 'online' && b.status === 'online') {
            return 1;
        } else {
            return 0;
        }
    });

    divListFriends.appendChild(ul);
    friends.forEach(friend => {
        const li = document.createElement('li');
        li.className = 'friendItem';
        const cardFriend = document.createElement('div');
        cardFriend.className = 'card d-flex flex-row align-items-center p-2 shadow-sm';

        const avatarFriend = document.createElement('img');
        avatarFriend.src = `data:image/png;base64, ${friend.avatar}`;
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