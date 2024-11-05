import { openModal } from './utils.js';

export async function createModalInfo(userData) {
    const modalInfo = document.createElement('div');
    modalInfo.className = 'modal fade modalInfo';
    modalInfo.id = 'modalInfo';
    modalInfo.setAttribute('aria-labelledby', 'modalInfoLabel');
    modalInfo.setAttribute('aria-hidden', 'true');

    const modalInfoDialog = document.createElement('div');
    modalInfoDialog.className = "modal-dialog modalInfoDialog";
    modalInfo.appendChild(modalInfoDialog);

    const modalInfoContent = document.createElement('div');
    modalInfoContent.className = 'modal-content modalInfoContent';
    modalInfoDialog.appendChild(modalInfoContent);

    const modalInfoHeader = document.createElement('div');
    modalInfoHeader.className = 'modal-header border-bottom border-custom-color pb-2 modalInfoHeader';
    modalInfoContent.appendChild(modalInfoHeader);

    const modalInfoTitle = document.createElement('h2');
    modalInfoTitle.textContent = 'Settings';
    modalInfoTitle.className = 'modal-title modalInfoTitle';
    modalInfoTitle.id = 'modalInfoLabel';
    modalInfoHeader.appendChild(modalInfoTitle);

    // Close button
    const modalInfoCloseButton = document.createElement('span');
    modalInfoCloseButton.id = 'closeButtonInfos';
    modalInfoCloseButton.setAttribute('data-bs-dismiss', 'modal');
    modalInfoCloseButton.setAttribute('aria-label', 'Close');
    modalInfoCloseButton.setAttribute('role', 'button'); // To make the element clickable
    modalInfoCloseButton.setAttribute('tabindex', '0'); // To make the element focusable
    modalInfoCloseButton.textContent = '×';
    modalInfoHeader.appendChild(modalInfoCloseButton);

// KEYBOARD ACCESSIBILITY
    // Event listener for keyboard accessibility: when the button is focused and we press Enter, the modal closes
    modalInfoCloseButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            modalInfoCloseButton.click();
        }
    });

// MOUSE ACCESSIBILITY
    // Event listener for mouse accessibility: when the button is focused and we click on it, the modal closes
    modalInfoCloseButton.addEventListener('click', () => {
        modalInfo.classList.remove('modalInfo-show');
        setTimeout(() => {
            modalInfo.style.display = 'none';
        }, 500);
    });

    const modalInfoBody = document.createElement('div');
    modalInfoBody.className = 'modal-body modalInfoBody text-body';
    modalInfoContent.appendChild(modalInfoBody);

    const modalInfoColumn = document.createElement('div');
    modalInfoColumn.className = 'd-flex flex-column';
    modalInfoBody.appendChild(modalInfoColumn);

    const modalInfoRow = document.createElement('div');
    modalInfoRow.className = 'd-flex flex-row';
    modalInfoColumn.appendChild(modalInfoRow);

    const modalInfoColumnInfos = document.createElement('div');
    modalInfoColumnInfos.className = 'd-flex flex-column';
    modalInfoRow.appendChild(modalInfoColumnInfos);

    const modalInfoColumnModify = document.createElement('div');
    modalInfoColumnModify.className = 'd-flex flex-column';
    modalInfoRow.appendChild(modalInfoColumnModify);

    // Add a button to modify user information
    const modifyIcon = document.createElement('div');
    modifyIcon.className = 'btn d-flex justify-content-end text-center modifyIcon';
    modifyIcon.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    modifyIcon.setAttribute('aria-label', 'Click to modify user information');
    modifyIcon.setAttribute('tabindex', '0');
    modifyIcon.setAttribute('role', 'button');
    modalInfoColumnModify.appendChild(modifyIcon);

// KEYBOARD ACCESSIBILITY
    // Event listener for keyboard accessibility: when the button is focused and we press Enter, the modalSettings opens
    modifyIcon.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            modifyIcon.click();
        }
    });

// MOUSE ACCESSIBILITY
    // Event listener for mouse click: when the button is focused and we click on it, the modalSettings opens
    modifyIcon.addEventListener('click', () => {
        // We close modalInfo before opening modalSettings
        const modalInfoElement = document.getElementById('modalInfo');
        if (modalInfoElement) {
            const bootstrapModalInfo = bootstrap.Modal.getInstance(modalInfoElement); // Get the instance of "modalInfo"
            if (bootstrapModalInfo) {
                bootstrapModalInfo.hide(); // Close "modalInfo"
            }
        }
        openModal(document.getElementById('modalSettings'));
    });

    const ModalUsernameElem = document.createElement('div');
    ModalUsernameElem.className = 'ModalUsernameElem';
    ModalUsernameElem.textContent = `Username : ${userData.username}`;
    modalInfoColumnInfos.appendChild(ModalUsernameElem);

    const ModalNicknameElem = document.createElement('div');
    ModalNicknameElem.className = 'ModalNicknameElem';
    ModalNicknameElem.textContent = `Nickname : ${userData.nickname}`;
    modalInfoColumnInfos.appendChild(ModalNicknameElem);

    const ModalEmailElem = document.createElement('div');
    ModalEmailElem.className = 'ModalEmailElem';
    ModalEmailElem.textContent = `Email : ${userData.email}`;
    modalInfoColumnInfos.appendChild(ModalEmailElem);

    const ModalMDPElem = document.createElement('div');
    ModalMDPElem.className = 'ModalMDPElem';
    ModalMDPElem.textContent = `Password : *******`;
    modalInfoColumnInfos.appendChild(ModalMDPElem);

    const ModalLanguageElem = document.createElement('div');
    ModalLanguageElem.className = 'ModalLanguageElem';
    ModalLanguageElem.textContent = `Language : ${userData.language}`;
    modalInfoColumnInfos.appendChild(ModalLanguageElem);

    const ModalPoliceElem = document.createElement('div');
    ModalPoliceElem.className = 'ModalPoliceElem';
    ModalPoliceElem.textContent = `Font size : ${userData.font_size}`;
    modalInfoColumnInfos.appendChild(ModalPoliceElem);

    const ModalModeElem = document.createElement('div');
    ModalModeElem.className = 'ModalModeElem';
    ModalModeElem.textContent = `Dark Mode : ${userData.theme}`;
    modalInfoColumnInfos.appendChild(ModalModeElem);

    return modalInfo;
}