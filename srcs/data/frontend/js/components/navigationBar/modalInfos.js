import { openModal } from './utils.js';

export async function createModalInfo(container, userData) {
    const modalInfo = document.createElement('div');
    modalInfo.className = 'modal fade modalInfo';
    modalInfo.id = 'modalInfo';
    modalInfo.setAttribute('tabindex', '-1');
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
    modalInfoHeader.appendChild(modalInfoTitle);

    // Bouton pour fermer la modale
    const modalInfoCloseButton = document.createElement('span');
    modalInfoCloseButton.id = 'closeButtonInfos';
    modalInfoCloseButton.setAttribute('data-bs-dismiss', 'modal');
    modalInfoCloseButton.setAttribute('aria-label', 'Close');
    modalInfoCloseButton.setAttribute('role', 'button'); // To make the element clickable
    modalInfoCloseButton.setAttribute('tabindex', '0'); // To make the element focusable
    modalInfoCloseButton.textContent = '×';
    modalInfoHeader.appendChild(modalInfoCloseButton);

    // Event listener for keyboard accessibility
    modalInfoCloseButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            modalInfo.classList.remove('modalInfo-show');
            setTimeout(() => {
                modalInfo.style.display = 'none';
            }, 500);
        }
    });

    // Event listener for mouse click
    modalInfoCloseButton.addEventListener('click', () => {
        modalInfo.classList.remove('modalInfo-show');
        setTimeout(() => {
            modalInfo.style.display = 'none';
        }, 500);
    });

    const modalInfoBody = document.createElement('div');
    modalInfoBody.className = 'modal-body';
    modalInfoContent.appendChild(modalInfoBody);

    const SvgModify = document.createElement('li');
    SvgModify.className = 'SvgModify bi bi-pencil-fill d-flex justify-content-end text-center';
    SvgModify.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    SvgModify.setAttribute('width', '16');
    SvgModify.setAttribute('height', '16');
    SvgModify.setAttribute('fill', 'currentColor');
    SvgModify.setAttribute('viewBox', '0 0 16 16');
    SvgModify.setAttribute('role', 'button'); // To make the element clickable
    SvgModify.setAttribute('tabindex', '0'); // To make the element focusable
    modalInfoBody.appendChild(SvgModify);

    // Event listener for keyboard accessibility
    SvgModify.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // We close modalInfo before opening modalSettings
            const modalInfoElement = document.getElementById('modalInfo');
            if (modalInfoElement) {
                const bootstrapModalInfo = bootstrap.Modal.getInstance(modalInfoElement); // Get the instance of "modalInfo"
                if (bootstrapModalInfo) {
                    bootstrapModalInfo.hide(); // Close "modalInfo"
                }
            }
            openModal(document.getElementById('modalSettings'));
        }
    });

    // Event listener for mouse click
    SvgModify.addEventListener('click', () => {
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
    modalInfoBody.appendChild(ModalUsernameElem);

    const ModalNicknameElem = document.createElement('div');
    ModalNicknameElem.className = 'ModalNicknameElem';
    ModalNicknameElem.textContent = `Nickname : ${userData.nickname}`;
    modalInfoBody.appendChild(ModalNicknameElem);

    const ModalEmailElem = document.createElement('div');
    ModalEmailElem.className = 'ModalEmailElem';
    ModalEmailElem.textContent = `Email : ${userData.email}`;
    modalInfoBody.appendChild(ModalEmailElem);

    const ModalMDPElem = document.createElement('div');
    ModalMDPElem.className = 'ModalMDPElem';
    ModalMDPElem.textContent = `Password : *******`;
    modalInfoBody.appendChild(ModalMDPElem);

    const ModalLanguageElem = document.createElement('div');
    ModalLanguageElem.className = 'ModalLanguageElem';
    ModalLanguageElem.textContent = `Language : ${userData.language}`;
    modalInfoBody.appendChild(ModalLanguageElem);

    const ModalPoliceElem = document.createElement('div');
    ModalPoliceElem.className = 'ModalPoliceElem';
    ModalPoliceElem.textContent = `Font size : ${userData.font_size}`;
    modalInfoBody.appendChild(ModalPoliceElem);

    const ModalModeElem = document.createElement('div');
    ModalModeElem.className = 'ModalModeElem';
    ModalModeElem.textContent = `Dark Mode : ${userData.theme}`;
    modalInfoBody.appendChild(ModalModeElem);

    return modalInfo;
}