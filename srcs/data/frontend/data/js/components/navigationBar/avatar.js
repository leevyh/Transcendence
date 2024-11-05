import { DEBUG, navigateTo } from '../../app.js';
import { actualPage, openModal } from './utils.js';
import { getCookie } from '../../views/utils.js';

// Creation of the avatar div
export async function createAvatarDiv(container, userData) {
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatarItem d-flex position-relative justify-content-center align-items-center rounded-circle overflow-hidden';

    const avatarImage = document.createElement('img');
    avatarImage.className = 'avatarImage w-100 h-auto pb-2';
    avatarImage.src = `data:image/png;base64, ${userData.avatar}`;
    avatarImage.alt = 'Avatar';
    avatarImage.setAttribute('aria-label', 'User avatar');
    avatarImage.setAttribute('role', 'img');
    avatarImage.setAttribute('tabindex', '0');
    avatarDiv.appendChild(avatarImage);

    // Create a modal to modify the avatar
    const modalAvatar = await createAvatarModal();
    container.appendChild(modalAvatar);

    // Add a button to modify user information
    const modifyAvatarIcon = document.createElement('div');
    modifyAvatarIcon.className = 'SVGModifyAvatar position-absolute';
    modifyAvatarIcon.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    modifyAvatarIcon.setAttribute('aria-label', 'Click to modify user avatar');
    modifyAvatarIcon.setAttribute('role', 'button');
    modifyAvatarIcon.style.opacity = '0'; // Hidden by default
    avatarDiv.appendChild(modifyAvatarIcon);

// KEYBOARD ACCESSIBILITY
    // Add event listener for keyboard accessibility: when the image is focused, show that it's focused
    avatarImage.addEventListener('focus', () => {
        avatarImage.style.boxShadow = '0 0 0 4px rgba(0, 123, 255, 0.4)';
        avatarImage.style.transform = 'scale(1.05)';
        avatarImage.style.filter = 'blur(5px)';
        modifyAvatarIcon.style.opacity = '1';
    });

    // Delete the styles when the image is not focused
    avatarImage.addEventListener('blur', () => {
        avatarImage.style.boxShadow = 'none';
        avatarImage.style.transform = 'none';
        avatarImage.style.filter = 'none';
        modifyAvatarIcon.style.opacity = '0';
    });

    // Event listener for keyboard accessibility: when the image is focused and the Enter key is pressed, open the modal
    avatarImage.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            openModal(document.getElementById('modalAvatar'));
        }
    });

// MOUSE ACCESSIBILITY
    // Add event listener for mouse accessibility: when the image is hovered, show the modify icon
    avatarImage.addEventListener('mouseover', () => {
        avatarImage.style.filter = 'blur(5px)';
        modifyAvatarIcon.style.opacity = '1';
    });
    
    // Delete the styles when the mouse is not on the image
    avatarImage.addEventListener('mouseout', () => {
        avatarImage.style.filter = 'none';
        modifyAvatarIcon.style.opacity = '0';
    });

    // Event listener for mouse accessibility: when the pencil icon is hovered, continue showing the modify icon
    modifyAvatarIcon.addEventListener('mouseover', () => {
        avatarImage.style.filter = 'blur(5px)';
        modifyAvatarIcon.style.opacity = '1';
    });

    // Event listener for mouse accessibility: when the image is clicked, open the modal
    modifyAvatarIcon.addEventListener('click', () => {
        openModal(document.getElementById('modalAvatar'));
    });

    return avatarDiv;
}

// Create the avatar modal to modify the avatar or remove it
async function createAvatarModal() {
    const modalAvatar = document.createElement('div');
    modalAvatar.className = 'modal fade modalAvatar';
    modalAvatar.id = 'modalAvatar';
    modalAvatar.setAttribute('aria-labelledby', 'modalAvatarLabel');
    modalAvatar.setAttribute('aria-hidden', 'true');

    const modalAvatarDialog = document.createElement('div');
    modalAvatarDialog.className = "modal-dialog modalAvatarDialog";
    modalAvatar.appendChild(modalAvatarDialog);

    const modalAvatarContent = document.createElement('div');
    modalAvatarContent.className = 'modal-content modalAvatarContent';
    modalAvatarDialog.appendChild(modalAvatarContent);

    const modalAvatarHeader = document.createElement('div');
    modalAvatarHeader.className = 'modal-header border-bottom border-custom-color pb-2 modalAvatarHeader';
    modalAvatarContent.appendChild(modalAvatarHeader);

    const modalAvatarTitle = document.createElement('h2');
    modalAvatarTitle.textContent = 'Avatar';
    modalAvatarTitle.className = 'modal-title modalAvatarTitle';
    modalAvatarTitle.id = 'modalAvatarLabel';
    modalAvatarHeader.appendChild(modalAvatarTitle);

    const modalAvatarCloseButton = document.createElement('span');
    modalAvatarCloseButton.id = 'closeButtonAvatar';
    modalAvatarCloseButton.setAttribute('data-bs-dismiss', 'modal');
    modalAvatarCloseButton.setAttribute('aria-label', 'Close');
    modalAvatarCloseButton.setAttribute('role', 'button'); // To make the button clickable
    modalAvatarCloseButton.setAttribute('tabindex', '0'); // To make the button focusable
    modalAvatarCloseButton.textContent = '×';
    modalAvatarHeader.appendChild(modalAvatarCloseButton);

// KEYBOARD ACCESSIBILITY
    // Event listener for keyboard accessibility: when the button is focused and the Enter key is pressed, close the modal
    modalAvatarCloseButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            modalAvatarCloseButton.click();
        }
    });

// MOUSE ACCESSIBILITY
    // Event listener for mouse accessibility: when the button is focused and we click on it, close the modal
    modalAvatarCloseButton.addEventListener('click', () => {
        modalAvatar.classList.remove('modalAvatar-show');
        setTimeout(() => {
            modalAvatar.style.display = 'none';
        }, 500);
    });

    const modalAvatarBody = document.createElement('div');
    modalAvatarBody.className = 'modal-body';
    modalAvatarContent.appendChild(modalAvatarBody);

    const avatarForm = document.createElement('form');
    avatarForm.className = 'w-100';
    modalAvatarBody.appendChild(avatarForm);

    const newAvatar = document.createElement('input');
    newAvatar.type = 'file';
    newAvatar.id = 'avatar';
    newAvatar.name = 'newAvatar';
    newAvatar.setAttribute('aria-label', 'Select a new avatar');
    newAvatar.className = 'form-control mb-4';
    avatarForm.appendChild(newAvatar);

    const avatarSubmitButton = document.createElement('button');
    avatarSubmitButton.type = 'submit';
    avatarSubmitButton.className = 'btn btn-primary w-100 mb-3 d-flex justify-content-center align-items-center';
    avatarSubmitButton.textContent = 'Save avatar';
    avatarForm.appendChild(avatarSubmitButton);

    const removeAvatarButton = document.createElement('button');
    removeAvatarButton.type = 'button';
    removeAvatarButton.className = 'btn btn-danger w-100';
    removeAvatarButton.textContent = 'Remove avatar';
    avatarForm.appendChild(removeAvatarButton);

    // Submit event to update the avatar
    avatarForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Remove previous messages
        const errorMessages = avatarForm.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());
        const successMessages = avatarForm.querySelectorAll('.text-success');
        successMessages.forEach(message => message.remove());

        // Get the file from the form
        const data = new FormData(avatarForm);
        const avatarFile = data.get('newAvatar');

        // Check if a file is selected, otherwise display an error message
        if (!avatarFile.size || avatarFile.name === '') {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Error: You need to select a file.';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
            setTimeout(() => errorMessage.remove(), 3000);
            return;
        }
        // Check if the file is an image, otherwise display an error message
        const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!acceptedTypes.includes(avatarFile.type)) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Error: File type not supported.';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
            setTimeout(() => errorMessage.remove(), 3000);
            return;
        }
        // Check if the file size is less than 1 MB, otherwise display an error message
        if (avatarFile.size > 1000000) { // 1MB max
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Error: File too large (1MB max).';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
            setTimeout(() => errorMessage.remove(), 3000);
            return;
        }

        try {
            const response = await fetch('/api/updateAvatar/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: avatarFile,
            });

            if (response.ok) {
                const result = await response.json();

                const successMessage = document.createElement('p');
                successMessage.className = 'text-success';
                successMessage.textContent = 'Avatar successfully modified';
                avatarForm.appendChild(successMessage);

                // Close the modal and refresh the page
                setTimeout(() => {
                    const modalElement = document.getElementById('modalAvatar');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();

                    document.body.style.filter = 'blur(5px)';

                    navigateTo(actualPage());

                    let blurAmount = 4;
                    const interval = setInterval(() => {
                        blurAmount -= 0.1;
                        document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

                        if (blurAmount <= 0) {
                            clearInterval(interval);
                        }
                    }, 25);
                }, 800);
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Error when modifying the avatar';
                avatarForm.insertBefore(errorMessage, avatarSubmitButton);
            }
        } catch (error) {
            if (DEBUG) console.error('Error during the avatar update', error);
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'An error occurred while updating the avatar';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
        }
    });

    // Remove avatar event
    removeAvatarButton.addEventListener('click', async () => {
        // Remove previous messages
        const errorMessages = avatarForm.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());
        const successMessages = avatarForm.querySelectorAll('.text-success');
        successMessages.forEach(message => message.remove());

        try {
            const response = await fetch('/api/deleteAvatar/', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            if (response.ok) {
                // Update the avatar image path by the default avatar path
                // const avatarImage = document.querySelector('.avatarImage');
                // avatarImage.src = '/path/to/default-avatar.png'; // FIXME: Update the path to the default avatar

                const successMessage = document.createElement('p');
                successMessage.className = 'text-success';
                successMessage.textContent = 'Avatar successfully removed';
                avatarForm.appendChild(successMessage);

                // Close the modal and refresh the page
                setTimeout(() => {
                    const modalElement = document.getElementById('modalAvatar');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();

                    document.body.style.filter = 'blur(5px)';

                    navigateTo(actualPage());

                    let blurAmount = 4;
                    const interval = setInterval(() => {
                        blurAmount -= 0.1;
                        document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

                        if (blurAmount <= 0) {
                            clearInterval(interval);
                        }
                    }, 25);
                }, 800);
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'An error occurred while removing the avatar.';
               avatarForm.insertBefore(errorMessage, removeAvatarButton);
            }
        } catch (error) {
            if (DEBUG) console.error('Error during the avatar removal', error);
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'An error occurred while removing the avatar.';
            avatarForm.insertBefore(errorMessage, removeAvatarButton);
        }
    });

    return modalAvatar;
}
