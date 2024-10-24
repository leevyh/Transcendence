import { DEBUG, navigateTo } from '../../app.js';

// Refresh actual page without reload (SPA)
export function actualPage() {
    console.log('window.location.href:', window.location.href);
    let location = window.location.href;
    const str_split = location.split('/');
    const length = str_split.length;
    const locationFinal = '/' + str_split[length - 1];

    return locationFinal;
}

// Function to create a navigation button from a text and an onClick function
export function createNavButton(text, onClick) {
    const listItem = document.createElement('li');
    listItem.className = 'ElemListNavBar text-center py-2';

    const button = document.createElement('button');
    button.className = 'btn text-primary';
    button.textContent = text;

    // Remove the outline when the button loses focus
    button.addEventListener('blur', () => {
        button.style.outline = 'none';
    });

    listItem.appendChild(button);

    button.addEventListener('click', () => {
        if (DEBUG) {
            console.log(`Navigating to ${text}`, 'actual:', window.location.pathname);
        }

        // Check if the text is "pong" and redirect to "/menuPong"
        const targetPath = text.toLowerCase() === 'pong' ? '/menuPong' : `/${text.toLowerCase()}`;

        console.log("targetPath:", targetPath);
        if (window.location.pathname === targetPath) {
            return;
        }
        onClick();
    });

    return listItem;
}

// Function to open the modal with the given title and content
export function openModal(modalToOpen) {
    // Use the Bootstrap API to show the modal
    const bootstrapModal = new bootstrap.Modal(modalToOpen);

    // Put the modal next to the navigation bar
    const navBar = document.querySelector('.nav');
    const rect = navBar.getBoundingClientRect();

    modalToOpen.style.position = 'absolute';
    modalToOpen.style.top = `${rect.top}px`;
    modalToOpen.style.left = `${rect.right + 10}px`;

    modalToOpen.style.margin = '0';
    modalToOpen.style.transform = 'none';
    modalToOpen.style.maxWidth = 'none';
    bootstrapModal.show();
}

export function closeModal(modalToClose) {
    if (modalToClose) console.log('modalToClose');
    setTimeout(() => {
        // Use the Bootstrap API to hide the modal
        const modalInstance = bootstrap.Modal.getInstance(modalToClose);
        modalInstance.hide();

        document.body.style.filter = 'blur(5px)'; // Add a blur effect to the body

        const actual = actualPage();
        navigateTo(actual); // Refresh the page without reloading       

        let blurAmount = 4;
        const interval = setInterval(() => {
            blurAmount -= 0.1;
            document.body.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

            if (blurAmount <= 0) {
                clearInterval(interval);
            }
        }, 25);
    }, 800);
}