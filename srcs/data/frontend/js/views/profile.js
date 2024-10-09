import { navigationBar } from './navigation.js';
import { notifications } from './notifications.js';

export async function profileView(container) {
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
    usersContainer.className = 'usersContainer flex-fill p-3';
    mainDiv.appendChild(usersContainer);

    const userPosition = document.createElement('div');
    userPosition.className = 'userPosition d-flex flex-column mb-3';
    usersContainer.appendChild(userPosition);

    const TitlePosition = document.createElement('h5');
    TitlePosition.className = 'TitlePosition d-flex justify-content-center pt-3 w-100 p-2';
    TitlePosition.textContent = '58';
    TitlePosition.style.display = 'inline-block';
    userPosition.appendChild(TitlePosition);

    const ContentPosition = document.createElement('div');
    ContentPosition.className = 'ContentPosition flex-grow-1 d-flex flex-row p-3';
    userPosition.appendChild(ContentPosition);

    const podiumContener = document.createElement('div');
    podiumContener.className = 'podiumContener d-flex flex-column w-100 h-100';
    ContentPosition.appendChild(podiumContener);

    const firstplace = document.createElement('div');
    firstplace.className = 'firstplace d-flex justify-content-center align-items-center flex-column w-100 h-50';
    podiumContener.appendChild(firstplace);

    const firstplaceContainer = document.createElement('div');
    firstplaceContainer.className = 'd-flex flex-column justify-content-center align-items-center w-100 h-100';
    firstplace.appendChild(firstplaceContainer);

    const TextFirstPos =  document.createElement('h6');
    TextFirstPos.className = 'TextFirstPos';
    TextFirstPos.textContent = '1st';
    TextFirstPos.style.margin = '0';
    firstplaceContainer.appendChild(TextFirstPos);


    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container position-relative d-flex justify-content-center align-items-center';
    imgContainer.style.width = '90px';
    imgContainer.style.height = '90px';
    firstplace.appendChild(imgContainer);

    const Laurier = document.createElement('img');
    Laurier.src = '/js/img/laurier.png';
    Laurier.alt = 'Laurier';
    Laurier.className = 'Laurier d-none d-md-block';
    Laurier.style.width = '90px';
    Laurier.style.height = '90px';
    Laurier.style.objectFit = 'cover';
    imgContainer.appendChild(Laurier);

    const imgAv = document.createElement('img');
    imgAv.src = '/js/img/women.svg';
    imgAv.alt = 'Avatar First Place';
    imgAv.className = 'imgAv';
    imgAv.style.width = '50px';
    imgAv.style.height = '50px';
    imgAv.style.position = 'absolute';
    imgAv.style.transform = 'translate(-50%, -50%)';
    imgAv.style.top = '50%';
    imgAv.style.left = '50%';
    imgContainer.appendChild(imgAv);

    const FirstUserName = document.createElement('div');
    FirstUserName .className = 'thirdUserName m-0 text-center fs-6 d-none d-lg-block';
    FirstUserName .textContent = 'firstname';
    firstplaceContainer.appendChild(FirstUserName);


    const otherplace = document.createElement('div');
    otherplace.className = 'otherplace w-100 d-flex flex-row ';
    podiumContener.appendChild(otherplace);

    const secplace = document.createElement('div');
    secplace.className = 'secplace d-flex justify-content-center align-items-start flex-column w-50 h-100 d-none d-md-block';
    otherplace.appendChild(secplace);

    const secplaceContainer = document.createElement('div');
    secplaceContainer.className = 'd-flex flex-column justify-content-center align-items-center w-100 h-100';
    secplace.appendChild(secplaceContainer);

    const TextSecPos = document.createElement('h6');
    TextSecPos.className = 'TextSecPos text-center w-100 mb-2';
    TextSecPos.textContent = '2nd';
    TextSecPos.style.margin = '0';
    secplaceContainer.appendChild(TextSecPos);

    const imgContainerSecPos = document.createElement('div');
    imgContainerSecPos.className = 'img-container d-flex justify-content-center align-items-start w-100 h-50';
    imgContainerSecPos.style.width = '90px';
    imgContainerSecPos.style.height = '90px';
    secplaceContainer.appendChild(imgContainerSecPos);

    const img2Av = document.createElement('img');
    img2Av.src = '/js/img/women.svg';
    img2Av.alt = 'Avatar Second Place';
    img2Av.className = 'img2Av';
    img2Av.style.width = '50px';
    img2Av.style.height = '50px';
    imgContainerSecPos.appendChild(img2Av);

    const SecUserName = document.createElement('div');
    SecUserName.className = 'SecUserName m-0 text-center fs-6 d-none d-lg-block';
    SecUserName.textContent = 'secondname';
    secplaceContainer.appendChild(SecUserName);

    const thirdplace = document.createElement('div');
    thirdplace.className = 'thirdplace d-flex justify-content-center align-items-start flex-column w-50 h-100 d-none d-md-block';  // Ajout de overflow-hidden ici
    otherplace.appendChild(thirdplace);

    const thirdplaceContainer = document.createElement('div');
    thirdplaceContainer.className = 'd-flex flex-column justify-content-center align-items-center w-100 h-100';
    thirdplace.appendChild(thirdplaceContainer);

    const TextThirdPos = document.createElement('h6');
    TextThirdPos.className = 'TextThirdPos text-center w-100 mb-2';
    TextThirdPos.textContent = '3rd';
    TextThirdPos.style.margin = '0';
    thirdplaceContainer.appendChild(TextThirdPos);

    const imgContainerThirdPos = document.createElement('div');
    imgContainerThirdPos.className = 'img-container d-flex justify-content-center align-items-start w-100 h-50';
    imgContainerThirdPos.style.width = '90px';
    imgContainerThirdPos.style.height = '90px';
    thirdplaceContainer.appendChild(imgContainerThirdPos);

    const img3Av = document.createElement('img');
    img3Av.src = '/js/img/women.svg';
    img3Av.alt = 'Avatar Third Place';
    img3Av.className = 'img3Av';
    img3Av.style.width = '50px';
    img3Av.style.height = '50px';
    imgContainerThirdPos.appendChild(img3Av);

    const thirdUserName = document.createElement('div');
    thirdUserName.className = 'thirdUserName m-0 text-center fs-6 d-none d-lg-block';
    thirdUserName.textContent = 'thirdname';
    thirdplaceContainer.appendChild(thirdUserName);


    const userStatsProfile = document.createElement('div');
    userStatsProfile.className = 'userStatsProfile';
    usersContainer.appendChild(userStatsProfile);

    const ContentuserStatsProfile = document.createElement('div');
    ContentuserStatsProfile.className = 'ContentuserStatsProfile d-flex justify-content-center flex-row w-100 h-100';
    userStatsProfile.appendChild(ContentuserStatsProfile);

    // Conteneur pour le taux de victoire
    const CharWinRateContener = document.createElement('div');
    CharWinRateContener.className = 'CharWinRateContener  d-flex justify-content-center align-items-center flex-column h-100 w-50'; // w-50 pour 50%
    ContentuserStatsProfile.appendChild(CharWinRateContener);

    const ChartGame = document.createElement('div');
    ChartGame.className = 'ChartGame bg-black w-100 h-75 d-flex align-items-center';
    CharWinRateContener.appendChild(ChartGame);

    // Conteneur pour les statistiques de l'utilisateur
    const UserStatsContener = document.createElement('div');
    UserStatsContener.className = 'UserStatsContener h-100 w-50 d-flex jsutify-content-center align-items-center ms-1';
    ContentuserStatsProfile.appendChild(UserStatsContener);

    const UserStats = document.createElement('div');
    UserStats.className = 'UserStats w-100 h-75 d-flex flex-column align-items-center'; // Utiliser flex-column pour empiler les éléments
    UserStatsContener.appendChild(UserStats);

    const ContenerNbWin = document.createElement('div');
    ContenerNbWin.className = 'ContenerNbWin d-flex flex-column align-items-center w-100'; // Utiliser flex-column pour empiler le titre et la barre
    UserStats.appendChild(ContenerNbWin);

    // Créer un titre pour les victoires
    // const TitleNbWin = document.createElement('p');
    // TitleNbWin.className = 'TitleNbWin mb-2 text-success d-flex align-items-start'; // Ajout d'une marge en bas
    // TitleNbWin.textContent = 'Victories';
    // ContenerNbWin.appendChild(TitleNbWin);

    // Créer le conteneur de la barre de progression
    const ProgressContainer = document.createElement('div');
    ProgressContainer.className = 'progress w-75 mb-3'; // Ajouter w-75 pour définir la largeur de la barre
    ProgressContainer.setAttribute('role', 'progressbar');
    ProgressContainer.setAttribute('aria-label', 'Progress example');
    ProgressContainer.setAttribute('aria-valuenow', '25');
    ProgressContainer.setAttribute('aria-valuemin', '0');
    ProgressContainer.setAttribute('aria-valuemax', '100');
    ContenerNbWin.appendChild(ProgressContainer);

    const ProgressBar = document.createElement('div');
    ProgressBar.className = 'ProgressBar progress-bar progress-bar-striped bg-success overflow-visible'; // Classe Bootstrap pour la barre de progression
    ProgressBar.textContent = 'Wins';
    ProgressBar.style.fontSize = '90%'; // Définit la largeur de la barre de progression
    ProgressContainer.appendChild(ProgressBar);

    // Fonction générique pour mettre à jour la barre de progression
    function updateProgressBarWin(wins, totalGames) {
        const progressBar = document.querySelector('.progress-bar.bg-success'); // Sélectionner la barre
        const progressContainer = document.querySelector('.progress'); // Sélectionner le conteneur

        if (totalGames === 0) {
            progressBar.style.width = '0%'; // Si aucun jeu n'a été joué, la barre est vide
            progressContainer.setAttribute('aria-valuenow', '0');
        } else {
            const winPercentage = (wins / totalGames) * 100; // Calcul du pourcentage de victoires
            progressBar.style.width = `${winPercentage}%`; // Mise à jour de la largeur
            progressContainer.setAttribute('aria-valuenow', winPercentage.toFixed(2)); // Mise à jour de l'attribut
        }
    }

    // Simuler des valeurs pour les victoires et les parties jouées (peuvent être remplacées plus tard par les données de l'API)
    let wins = 60;      // Valeur fictive pour les victoires
    let totalGames = 100; // Valeur fictive pour les jeux joués

    // Appel de la fonction avec les valeurs actuelles
    updateProgressBarWin(wins, totalGames);

    const ContenerNbLoss = document.createElement('div');
    ContenerNbLoss.className = 'ContenerNbLoss py-2 d-flex flex-column align-items-center w-100';
    UserStats.appendChild(ContenerNbLoss);

    // // Créer un titre pour les défaites
    // const TitleNbLoss = document.createElement('p');
    // TitleNbLoss.className = 'TitleNbLoss mb-2 text-danger d-flex align-items-start'; // Ajout d'une marge en bas
    // TitleNbLoss.textContent = 'Defeats';
    // ContenerNbLoss.appendChild(TitleNbLoss);

    // Créer le conteneur de la barre de progression
    const ProgressContainerLoss = document.createElement('div');
    ProgressContainerLoss.className = 'progress w-75 position-relative'; // Ajouter w-75 pour définir la largeur de la barre
    ProgressContainerLoss.setAttribute('role', 'progressbar');
    ProgressContainerLoss.setAttribute('aria-label', 'Progress example');
    ProgressContainerLoss.setAttribute('aria-valuenow', '50');
    ProgressContainerLoss.setAttribute('aria-valuemin', '0');
    ProgressContainerLoss.setAttribute('aria-valuemax', '100');
    ContenerNbLoss.appendChild(ProgressContainerLoss);

    // Créer la barre de progression pour les défaites
    const ProgressBarLoss = document.createElement('div');
    ProgressBarLoss.className = 'ProgressBar overflow-visible progress-bar progress-bar-striped bg-danger'; // Classe Bootstrap pour la barre de progression
    ProgressBarLoss.textContent = 'Defeats';
    ProgressBarLoss.style.width = '40%'; // Définit la largeur de la barre de progression
    ProgressContainerLoss.appendChild(ProgressBarLoss); // Ajouter la barre de progression au conteneur

    // Fonction générique pour mettre à jour la barre de progression
    function updateProgressBarLosse(losse, totalGames) {
        const progressBar = document.querySelector('.progress-bar.bg-danger'); // Sélectionner la barre
        const progressContainer = document.querySelector('.progress'); // Sélectionner le conteneur

        if (totalGames === 0) {
            progressBar.style.width = '0%'; // Si aucun jeu n'a été joué, la barre est vide
            progressContainer.setAttribute('aria-valuenow', '0');
        } else {
            const winPercentage = (losse / totalGames) * 100; // Calcul du pourcentage de victoires
            progressBar.style.width = `${winPercentage}%`; // Mise à jour de la largeur
            progressContainer.setAttribute('aria-valuenow', winPercentage.toFixed(2)); // Mise à jour de l'attribut
        }
    }

    // Simuler des valeurs pour les victoires et les parties jouées (peuvent être remplacées plus tard par les données de l'API)
    let losse = 100;      // Valeur fictive pour les victoires
    // let totalGames = 100; // Valeur fictive pour les jeux joués

    // Appel de la fonction avec les valeurs actuelles
    updateProgressBarLosse(losse, totalGames);

    const ContenerPointTaken = document.createElement('div');
    ContenerPointTaken.className = 'ContenerPointTaken py-2 d-flex flex-column align-items-center w-100';
    UserStats.appendChild(ContenerPointTaken);

    // Créer un titre pour les défaites
    const TitlePointTaken = document.createElement('p');
    TitlePointTaken.className = 'TitlePointTaken mb-2 d-flex align-items-start'; // Ajout d'une marge en bas
    TitlePointTaken.textContent = 'Point Taken';
    ContenerPointTaken.appendChild(TitlePointTaken);

    // Créer le conteneur de la barre de progression
    const NumberPointTaken = document.createElement('div');
    NumberPointTaken.className = 'NumberPointTaken';
    NumberPointTaken.textContent = '36';
    ContenerPointTaken.appendChild(NumberPointTaken);


    const ContenerPointGiven = document.createElement('div');
    ContenerPointGiven.className = 'ContenerPointGiven py-2 d-flex flex-column align-items-center w-100';
    UserStats.appendChild(ContenerPointGiven);

    // Créer un titre pour les défaites
    const TitlePointGiven = document.createElement('p');
    TitlePointGiven.className = 'TitlePointGiven mb-2 d-flex align-items-start'; // Ajout d'une marge en bas
    TitlePointGiven.textContent = 'Point Given';
    ContenerPointGiven.appendChild(TitlePointGiven);

    // Créer le conteneur de la barre de progression
    const NumberPointGiven = document.createElement('div');
    NumberPointGiven.className = 'NumberPointGiven';
    NumberPointGiven.textContent = '49';
    ContenerPointGiven.appendChild(NumberPointGiven);

    const ContenerNbGame = document.createElement('div');
    ContenerNbGame.className = 'ContenerNbGame py-2 d-flex flex-column align-items-center w-100';
    UserStats.appendChild(ContenerNbGame);

    // Créer un titre pour les défaites
    const TitleNbGame = document.createElement('p');
    TitleNbGame.className = 'TitleNbGame mb-2 d-flex align-items-start'; // Ajout d'une marge en bas
    TitleNbGame.textContent = 'Point Given';
    ContenerNbGame.appendChild(TitleNbGame);

    // Créer le conteneur de la barre de progression
    const NumberGame = document.createElement('div');
    NumberGame.className = 'NumberGame';
    NumberGame.textContent = '84';
    ContenerNbGame.appendChild(NumberGame);

//nb_games': stats.nb_games,
// 'nb_wins': stats.nb_wins,
// 'nb_losses': stats.nb_losses,
// 'win_rate': stats.win_rate,
// 'nb_point_taken' :stats.nb_point_taken,
// 'nb_point_given' :stats.nb_point_given,

    const ContainerHistorical = document.createElement('div');
    ContainerHistorical.className = 'ContainerHistorical flex-fill pt-3';  // Ajout de la classe ContainerHistorical
    mainDiv.appendChild(ContainerHistorical);

    const historical = document.createElement('div');
    historical.className = 'historical h-100';
    ContainerHistorical.appendChild(historical);

    const notifications_div = await notifications();
    div.appendChild(notifications_div);


}
