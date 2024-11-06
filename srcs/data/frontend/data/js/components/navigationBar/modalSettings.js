import { DEBUG } from '../../app.js';
import { getCookie } from '../../views/utils.js';
import { closeModal } from './utils.js';

export async function createModalSettings(userData) {
    const modalSettings = document.createElement('div');
    modalSettings.className = 'modal fade modalSettings';
    modalSettings.id = 'modalSettings';
    modalSettings.setAttribute('aria-labelledby', 'modalSettingsLabel');
    modalSettings.setAttribute('aria-hidden', 'true');
    modalSettings.setAttribute('tabindex', '-1');
    modalSettings.setAttribute('role', 'dialog');

    const modalSettingsDialog = document.createElement('div');
    modalSettingsDialog.className = 'modal-dialog modalSettingsDialog';
    modalSettings.appendChild(modalSettingsDialog);

    const modalSettingsContent = document.createElement('div');
    modalSettingsContent.className = 'modal-content modalSettingsContent';
    modalSettingsDialog.appendChild(modalSettingsContent);

    const modalSettingsHeader = document.createElement('div');
    modalSettingsHeader.className = 'modal-header border-bottom border-custom-color pb-2 modalSettingsHeader';
    modalSettingsContent.appendChild(modalSettingsHeader);

    const modalSettingsTitle = document.createElement('h2');
    modalSettingsTitle.textContent = 'Modify Settings ';
    modalSettingsTitle.className = 'modal-title modalSettingsTitle';
    modalSettingsTitle.id = 'modalSettingsLabel';
    modalSettingsHeader.appendChild(modalSettingsTitle);

    // Close button
    const modalSettingsCloseButton = document.createElement('span');
    modalSettingsCloseButton.id = 'closeButtonParam';
    modalSettingsCloseButton.setAttribute('data-bs-dismiss', 'modal');
    modalSettingsCloseButton.setAttribute('aria-label', 'Close');
    modalSettingsCloseButton.setAttribute('role', 'button'); // To make the element clickable
    modalSettingsCloseButton.setAttribute('tabindex', '0'); // To make the element focusable
    modalSettingsCloseButton.textContent = '×';
    modalSettingsHeader.appendChild(modalSettingsCloseButton);

// KEYBOARD ACCESSIBILITY
    // Event listener for keyboard accessibility: when the button is focused and we press Enter, the modal closes and the focus goes back to the button
    modalSettingsCloseButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            modalSettingsCloseButton.click();
        }
    });

// MOUSE ACCESSIBILITY
    // Event listener for mouse click: when the button is focused and we click on it, the modal closes
    modalSettingsCloseButton.addEventListener('click', () => {
        modalSettings.classList.remove('modalSettings-show');
        setTimeout(() => {
            modalSettings.style.display = 'none';
        }, 500);
    });

    const modalSettingsBody = document.createElement('div');
    modalSettingsBody.className = 'modal-body modalSettingsBody text-body';
    modalSettingsContent.appendChild(modalSettingsBody);

    // Creation of the settings form
    const settingsForm = await createSettingsForm();
    modalSettingsBody.appendChild(settingsForm);

    const accessibilityForm = await createAccessibilityForm(userData);
    modalSettingsBody.appendChild(accessibilityForm);

    return modalSettings;
}

async function createSettingsForm() {
    const settingsForm = document.createElement('form');
    settingsForm.className = 'w-100';

    // Creation of the username field
    const newNicknameModify = document.createElement('input');
    newNicknameModify.type = 'text';
    newNicknameModify.id = 'nickname';
    newNicknameModify.name = 'newNicknameModify';
    newNicknameModify.className = 'form-control mb-4';
    newNicknameModify.placeholder = 'New nickname';
    settingsForm.appendChild(newNicknameModify);

    // Creation of the email field
    const newEmailModify = document.createElement('input');
    newEmailModify.type = 'email';
    newEmailModify.id = 'email';
    newEmailModify.name = 'newEmailModify';
    newEmailModify.className = 'form-control mb-4';
    newEmailModify.placeholder = 'New email';
    settingsForm.appendChild(newEmailModify);

    // Submit button
    const settingsSubmitButton = document.createElement('button');
    settingsSubmitButton.type = 'submit';
    settingsSubmitButton.className = 'btn btn-primary w-100 modalSettingsButtonsSubmit';
    settingsSubmitButton.textContent = 'Submit';
    settingsForm.appendChild(settingsSubmitButton);

    // Handle the form submission
    settingsForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Delete previous messages (errors or success)
        const errorMessages = settingsForm.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());
        const successMessages = settingsForm.querySelectorAll('.text-success');
        successMessages.forEach(message => message.remove());

        // Get the form data
        const data = new FormData(settingsForm);
        const nickname = data.get('newNicknameModify');
        const email = data.get('newEmailModify');

        // Check the size of the nickname (between 3 and 10 characters)
        if (nickname && nickname.length < 3 || nickname.length > 10) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Nickname must be between 3 and 10 characters';
            settingsForm.insertBefore(errorMessage, settingsSubmitButton);
            return;
        }

        try {
            // Send the data to the server
            const response = await fetch('/api/updateSettings/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({ nickname, email })
            });

            if (response.ok) {
                const successMessage = document.createElement('p');
                successMessage.className = 'text-success';
                successMessage.textContent = 'Parameters successfully modified';
                settingsForm.appendChild(successMessage);

                // Reset the form after success
                settingsForm.reset();

                // Close the modal with Bootstrap
                closeModal(modalSettings);
            }
            else {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                return response.json().then(data => {
                    errorMessage.textContent = data.error;
                    settingsForm.insertBefore(errorMessage, settingsSubmitButton);
                    settingsForm.reset();
                });
            }
        } catch (error) {
            if (DEBUG) {console.error(error);}
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Network or server error';
            settingsForm.insertBefore(errorMessage, settingsSubmitButton);

            // Reset the form after success
            settingsForm.reset();
        }
    });

    return settingsForm;
}

async function createAccessibilityForm(userData) {
    // Creation of the form to modify accessibility settings {font_size, language} = accessibilityForm
    const accessibilityForm = document.createElement('form');
    accessibilityForm.className = 'w-100 mt-4 accessibilityForm';

    // Creation of the font size field
    const divFontSize = await createFontSizeDiv(userData);
    accessibilityForm.appendChild(divFontSize);

    // Creation of the language field
    const labelLanguage = document.createElement('label');
    labelLanguage.className = 'form-label';
    labelLanguage.textContent = 'Language';
    labelLanguage.style.color = '#000';
    labelLanguage.setAttribute('for', 'language'); // Associe le label avec le select
    accessibilityForm.appendChild(labelLanguage);

    const language = document.createElement('select');
    language.name = 'language';
    language.id = 'language';
    language.className = 'form-select mb-4';
    language.value = userData.language;
    accessibilityForm.appendChild(language);

    const optionEn = document.createElement('option');
    optionEn.value = 'en';
    optionEn.textContent = 'English';
    language.appendChild(optionEn);

    const optionFr = document.createElement('option');
    optionFr.value = 'fr';
    optionFr.textContent = 'Francais';
    language.appendChild(optionFr);

    const optionEs = document.createElement('option');
    optionEs.value = 'es';
    optionEs.textContent = 'Espanol';
    language.appendChild(optionEs);

    // Submit button
    const accessSubmitButton = document.createElement('button');
    accessSubmitButton.type = 'submit';
    accessSubmitButton.className = 'btn btn-primary w-100 modalSettingsButtonsSubmit';
    accessSubmitButton.textContent = 'Submit';
    accessibilityForm.appendChild(accessSubmitButton);

    // Event listener for the form submission
    accessibilityForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Remove previous messages (errors or success)
        const errorMessages = accessibilityForm.querySelectorAll('.text-danger');
        errorMessages.forEach(message => message.remove());
        const successMessages = accessibilityForm.querySelectorAll('.text-success');
        successMessages.forEach(message => message.remove());

        // Get the form data
        const data = new FormData(accessibilityForm);
        const font_size = data.get('font-size');
        const language = data.get('language');

        try {
            // Send the data to the server
            const response = await fetch('/api/updateAccessibility/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({ font_size, language })
            });

            if (response.ok) {
                const successMessage = document.createElement('p');
                successMessage.className = 'text-success';
                successMessage.textContent = 'Parameters successfully modified';
                accessibilityForm.appendChild(successMessage);

                closeModal(document.getElementById('modalSettings'));
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-danger';
                errorMessage.textContent = 'Error while modifying parameters';
                accessibilityForm.insertBefore(errorMessage, accessSubmitButton);

                // Reset the form after success
                accessibilityForm.reset();
            }
        } catch (error) {
            if (DEBUG) {console.error(error);}
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-danger';
            errorMessage.textContent = 'Network or server error';
            accessibilityForm.insertBefore(errorMessage, accessSubmitButton);

            // Reset the form after success
            accessibilityForm.reset();
        }
    });

    return accessibilityForm;
}

async function createFontSizeDiv(userData) {
    // Table of font sizes
    const fontSizes = {
        1: '12px',  // Small font
        2: '16px',  // Medium font
        3: '20px'   // Large font
    };

    const divFontSize = document.createElement('div');
    divFontSize.className = 'divFontSize d-flex flex-column';

    // Creation of the font size field
    const labelFontSize = document.createElement('label');
    labelFontSize.className = 'form-label labelFontSize';
    labelFontSize.textContent = 'Font size';
    labelFontSize.style.color = '#000';
    labelFontSize.setAttribute('for', 'font-size');  // Associe le label avec l'input
    divFontSize.appendChild(labelFontSize);

    const fontSize = document.createElement('input');
    fontSize.name = 'font-size';
    fontSize.type = 'range';
    fontSize.id = 'font-size';
    fontSize.className = 'form-control-range mb-2 cursor align-self-center fontSizeCursor';
    fontSize.min = 1;
    fontSize.max = 3;
    fontSize.value = userData.font_size;
    divFontSize.appendChild(fontSize);

    // Event listener for the font size field
    fontSize.addEventListener('input', (event) => {
        const sizeValue = event.target.value; // Get the value of the input range
        document.body.style.fontSize = fontSizes[sizeValue]; // Apply the font size to the body
    });

    return divFontSize;
}
