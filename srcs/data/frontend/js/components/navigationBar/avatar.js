import { DEBUG } from '../../app.js';
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
    avatarImage.setAttribute('role', 'button'); // To make the image clickable
    avatarImage.setAttribute('tabindex', '0'); // To make the image focusable
    avatarDiv.appendChild(avatarImage);

    // Create a modal to modify the avatar
    const modalAvatar = await createAvatarModal();
    container.appendChild(modalAvatar);

    // Create a SVG element to modify the avatar
    const SVGModifyAvatar = document.createElement('svg');
    SVGModifyAvatar.className = 'SVGModifyAvatar bi bi-pencil-fill position-absolute';
    SVGModifyAvatar.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    SVGModifyAvatar.setAttribute('width', '32');
    SVGModifyAvatar.setAttribute('height', '32');
    SVGModifyAvatar.setAttribute('fill', 'white');
    SVGModifyAvatar.setAttribute('viewBox', '0 0 16 16');
    SVGModifyAvatar.style.opacity = '0';
    SVGModifyAvatar.innerHTML = `
        <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9.146 9.146L5 13.5l.5-.5 9.146-9.146zM4 13.5V15h1.5l.146-.146L4 13.5zm-3.5.5a.5.5 0 0 1 0-1H1V12.5H.5a.5.5 0 0 1 0-1H1V11H.5a.5.5 0 0 1 0-1H1V9.5H.5a.5.5 0 0 1 0-1H1V8.5H.5a.5.5 0 0 1 0-1H1V7.5H.5a.5.5 0 0 1 0-1H1V6.5H.5a.5.5 0 0 1 0-1H1V5.5H.5a.5.5 0 0 1 0-1H1V4.5H.5a.5.5 0 0 1 0-1H1V3.5H.5a.5.5 0 0 1 0-1H1V2.5H.5a.5.5 0 0 1 0-1H1V1.5H.5a.5.5 0 0 1 0-1H1V.5H.5a.5.5 0 0 1 0-1H1V0h-.5a.5.5 0 0 1 0 1H1V.5H.5z"/>
    `;
    avatarDiv.appendChild(SVGModifyAvatar);

// KEYBOARD ACCESSIBILITY
    // Add event listener for keyboard accessibility: when the image is focused, show that it's focused
    avatarImage.addEventListener('focus', () => {
        avatarImage.style.filter = 'blur(5px)';
        SVGModifyAvatar.style.opacity = '1';
    });

    // Add event listener for keyboard accessibility: when the image is not focused, remove the blur effect
    avatarImage.addEventListener('blur', () => {
        avatarImage.style.filter = 'none';
        SVGModifyAvatar.style.opacity = '0';
    });

    // Event listener for keyboard accessibility: when the image is focused and the Enter key is pressed, open the modal
    avatarImage.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            openModal(document.getElementById('modalAvatar'));
        }
    });

// MOUSE ACCESSIBILITY
    // Event listener for mouse accessibility: when the mouse is over the image, add a blur effect
    avatarImage.addEventListener('mouseover', () => {
        avatarImage.style.filter = 'blur(5px)';
        SVGModifyAvatar.style.opacity = '1';
    });

    // Event listener for mouse accessibility: when the mouse is not over the image, remove the blur effect
    avatarImage.addEventListener('mouseout', () => {
        avatarImage.style.filter = 'none';
        SVGModifyAvatar.style.opacity = '0';
    });

    // Event listener for mouse accessibility: when the image is clicked, open the modal
    avatarImage.addEventListener('click', () => {
        openModal(document.getElementById('modalAvatar'));
    });

    return avatarDiv;
}

// Create the avatar modal to modify the avatar or remove it
async function createAvatarModal() {
    const modalAvatar = document.createElement('div');
    modalAvatar.className = 'modal fade modalAvatar';
    modalAvatar.id = 'modalAvatar';
    modalAvatar.setAttribute('tabindex', '-1');
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
            return;
        }
        // Check if the file is an image, otherwise display an error message
        if (!avatarFile.type.startsWith('image/')) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Error: File type not supported.';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
            return;
        }
        // Check if the file size is less than 1 MB, otherwise display an error message
        if (avatarFile.size > 1000000) { // 1MB max
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Error: File too large (1MB max).';
            avatarForm.insertBefore(errorMessage, avatarSubmitButton);
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
                const avatarImage = document.querySelector('.avatarImage');
                avatarImage.src = '/path/to/default-avatar.png'; // TODO: Fix this

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
