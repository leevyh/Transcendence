import { DEBUG, navigateTo } from '../app.js';
import { navigationBar } from './navigation.js';

export function profileView(container) {

    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navBarContainer = navigationBar(container);
    div.appendChild(navBarContainer);

    const mainDiv = document.createElement('div');
    mainDiv.className = 'd-flex flex-grow-1 m-4';
    div.appendChild(mainDiv);

    const usersContainer = document.createElement('div');
    usersContainer.className = 'flex-fill p-3 w-35 h-100';
    mainDiv.appendChild(usersContainer);

    const userPosition = document.createElement('div');
    userPosition.className = 'userPosition h-25 d-flex flex-column mb-3';
    usersContainer.appendChild(userPosition);

    const TitlePosition = document.createElement('h5');
    TitlePosition.className = 'TitlePosition d-flex justify-content-center pt-3';
    TitlePosition.textContent = 'Position : ';//////BACK///////////
    userPosition.appendChild(TitlePosition);

    const ContentPosition = document.createElement('div');
    ContentPosition.className = 'ContentPosition flex-grow-1 d-flex flex-row p-3 ';
    userPosition.appendChild(ContentPosition);

    const ChartGame = document.createElement('div');
    ChartGame.className = 'ChartGame me-4 d-flex justify-content-start bg-black  h-100 w-50';
    ContentPosition.appendChild(ChartGame);///////BACK///////////


    const podiumContener = document.createElement('div');
    podiumContener.className = 'podiumContener d-flex justify-content-end align-items-end w-50 h-100';
    ContentPosition.appendChild(podiumContener);

    const secondPlace = document.createElement('div');
    secondPlace.className = 'bg-secondary flex-fill d-flex justify-content-center align-items-center';
    secondPlace.textContent = '2';

    secondPlace.style.height = '40%';
    secondPlace.style.width = '20%';
    podiumContener.appendChild(secondPlace);

    const firstPlace = document.createElement('div');
    firstPlace.className = 'bg-warning flex-fill d-flex justify-content-center align-items-center';
    firstPlace.textContent= '1';
    firstPlace.style.height = '60%';
    firstPlace.style.width = '20%';
    podiumContener.appendChild(firstPlace);

    const thirdPlace = document.createElement('div');
    thirdPlace.className = 'thirdPlace flex-fill text-black d-flex justify-content-center align-items-center';
    thirdPlace.textContent= '3';
    thirdPlace.style.height = '30%';
    thirdPlace.style.width = '20%';
    podiumContener.appendChild(thirdPlace);



    const userStatsProfile = document.createElement('div');
    userStatsProfile.className = 'userStatsProfile h-75';
    usersContainer.appendChild(userStatsProfile);



    const ContainerHistorical = document.createElement('div');
    ContainerHistorical.className = 'flex-fill pt-3 w-65';
    mainDiv.appendChild(ContainerHistorical);

    const historical = document.createElement('div');
    historical.className = 'historical h-100';
    ContainerHistorical.appendChild(historical);
}


// import { DEBUG, navigateTo } from '../app.js';
// import { navigationBar } from './navigation.js';

// export function profileView(container) {

//     container.innerHTML = '';

//     const div = document.createElement('div');
//     div.className = 'd-flex h-100';
//     container.appendChild(div);

//     const navBarContainer = navigationBar(container);
//     div.appendChild(navBarContainer);

//     const mainDiv = document.createElement('div');
//     mainDiv.className = 'd-flex flex-grow-1 m-4';
//     div.appendChild(mainDiv);

//     const usersContainer = document.createElement('div');
//     usersContainer.className = 'flex-fill p-3 w-35 h-100';
//     mainDiv.appendChild(usersContainer);

//     const userPosition = document.createElement('div');
//     userPosition.className = 'userPosition h-25 d-flex flex-column mb-3';
//     usersContainer.appendChild(userPosition);

//     const TitlePosition = document.createElement('h5');
//     TitlePosition.className = 'TitlePosition d-flex justify-content-center pt-3';
//     TitlePosition.textContent = 'Position : ';//////BACK///////////
//     userPosition.appendChild(TitlePosition);

//     const ContentPosition = document.createElement('div');
//     ContentPosition.className = 'ContentPosition flex-grow-1 d-flex flex-row p-3 ';
//     userPosition.appendChild(ContentPosition);

//     const ChartGame = document.createElement('div');
//     ChartGame.className = 'ChartGame me-4 d-flex justify-content-start bg-black  h-100 w-50';
//     ContentPosition.appendChild(ChartGame);///////BACK///////////

//     // Créer le conteneur parent pour userPodium et podiumContener
//     const ContenerstatPodium = document.createElement('div');
//     ContenerstatPodium.className = 'ContenerstatPodium d-flex flex-column h-100 w-50';
//     ContentPosition.appendChild(ContenerstatPodium);

//     // Conteneur pour l'affichage de userPodium (au-dessus de podiumContener)
//     const userPodium = document.createElement('div');
//     userPodium.className = 'userPodium d-flex justify-content-center align-items-center bg-light';
//     userPodium.style.height = '10%';  // Hauteur réduite pour userPodium
//     // userPodium.textContent = 'User Podium Area'; // Exemple de texte pour identifier l'espace
//     ContenerstatPodium.appendChild(userPodium);

//     // Conteneur pour le podium (en dessous de userPodium)
//     const podiumContener = document.createElement('div');
//     podiumContener.className = 'podiumContener d-flex justify-content-center align-items-end flex-grow-1 h-75';  // flex-grow-1 pour occuper le reste de l'espace
//    // podiumContener.style.width = '100%'; // fonctionne pas
//     ContenerstatPodium.appendChild(podiumContener);

//     // Deuxième marche du podium
//     const secondPlace = document.createElement('div');
//     secondPlace.className = 'bg-secondary d-flex justify-content-center align-items-center';
//     secondPlace.textContent = '2';
//     secondPlace.style.height = '40%';
//     secondPlace.style.width = '20%';
//     podiumContener.appendChild(secondPlace);

//     // Première marche du podium (plus haute)
//     const firstPlace = document.createElement('div');
//     firstPlace.className = 'bg-warning d-flex justify-content-center align-items-center';
//     firstPlace.textContent = '1';
//     firstPlace.style.height = '60%';
//     firstPlace.style.width = '20%';
//     podiumContener.appendChild(firstPlace);

//     // Troisième marche du podium (plus basse)
//     const thirdPlace = document.createElement('div');
//     thirdPlace.className = 'bg-primary d-flex justify-content-center align-items-center';
//     thirdPlace.textContent = '3';
//     thirdPlace.style.height = '30%';
//     thirdPlace.style.width = '20%';
//     podiumContener.appendChild(thirdPlace);



//     const userStatsProfile = document.createElement('div');
//     userStatsProfile.className = 'userStatsProfile h-75';
//     usersContainer.appendChild(userStatsProfile);



//     const ContainerHistorical = document.createElement('div');
//     ContainerHistorical.className = 'flex-fill pt-3 w-65';
//     mainDiv.appendChild(ContainerHistorical);

//     const historical = document.createElement('div');
//     historical.className = 'historical h-100';
//     ContainerHistorical.appendChild(historical);
// }

