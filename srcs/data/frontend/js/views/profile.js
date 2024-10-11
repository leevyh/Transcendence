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

    const HeaderUser = document.createElement('div');
    HeaderUser.classList = 'HeaderUser d-flex justify-content-center align-items-center'; // Ajouter la classe 'd-flex' pour les mettre en ligne
    userPosition.appendChild(HeaderUser);

    const Titlehash = document.createElement('h5');
    Titlehash.className = 'TitlePosition Titlehash fst-italic py-3 ';
    Titlehash.textContent = '#';
    Titlehash.style.display = 'inline-block';
    HeaderUser.appendChild(Titlehash);

    const TitlePosition = document.createElement('h5');
    TitlePosition.className = 'TitlePosition py-3';
    TitlePosition.textContent = '58';
    TitlePosition.style.display = 'inline-block';
    HeaderUser.appendChild(TitlePosition);


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

    const HeaderStatsProfile = document.createElement('div');
    HeaderStatsProfile.className = 'HeaderStatsProfile ';
    userStatsProfile.appendChild(HeaderStatsProfile);

    const TitleStatsProfile = document.createElement('h5');
    TitleStatsProfile.className ='TitlePosition TitleStatsProfile d-flex justify-content-center align-items-center py-3';
    TitleStatsProfile.textContent = 'User Stats';
    HeaderStatsProfile.appendChild(TitleStatsProfile);

    const ContentuserStatsProfile = document.createElement('div');
    ContentuserStatsProfile.className = 'ContentuserStatsProfile d-flex justify-content-center flex-column w-100 h-75';
    userStatsProfile.appendChild(ContentuserStatsProfile);

    const CharWinRateContener = document.createElement('div');
    CharWinRateContener.className = 'CharWinRateContener d-flex justify-content-center align-items-center  w-100';
    ContentuserStatsProfile.appendChild(CharWinRateContener);


    // Définir les données pour les victoires (wins) et les pertes (losses)
    const wins = 20;  // Nombre de victoires
    const losse = 10; // Nombre de pertes
    const totalGames = wins + losse;

    // VERIFIER SI AUCUNE PARTIE N'EST JOUER
    function createPieChart(wins, losse, totalGames) {

        const canvas = document.createElement('canvas');
        canvas.id = 'myCanvas';
        canvas.className = 'h-100 p-1';
        CharWinRateContener.appendChild(canvas);

        const data = [wins, losse]; // Victoires et pertes
        const colors = ["#1e7145", "#b91d47"]; // Vert pour victoires, Rouge pour pertes
        const labels = ["Wins", "Defeats"];

        // Fonction pour dessiner un cercle rempli de blanc
        function drawFilledWhiteCircle(canvasId) {
            const canvas = document.getElementById(canvasId);
            const content = canvas.getContext('2d');

            // Dessiner un cercle plein blanc
            content.beginPath();
            content.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2) - 10, 0, 2 * Math.PI);
            content.closePath();
            content.fillStyle = "#ffffff"; // Remplir le cercle de blanc
            content.fill();
        }

        // Fonction pour dessiner le diagramme circulaire
        function drawPieChart(canvasId, data, colors, labels) {
            const canvas = document.getElementById(canvasId);
            const content = canvas.getContext('2d');
            const total = data.reduce((acc, value) => acc + value, 0); // Total des valeurs

            let startAngle = 0;
            for (let i = 0; i < data.length; i++) {
                const sliceAngle = (data[i] / total) * 2 * Math.PI;

                // Dessiner chaque portion du cercle
                content.beginPath();
                content.moveTo(canvas.width / 2, canvas.height / 2); // Centre du cercle
                content.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2) - 10, startAngle, startAngle + sliceAngle);
                content.closePath();

                // Remplir chaque portion avec la couleur correspondante
                content.fillStyle = colors[i];
                content.fill();

                // Ajouter des labels pour chaque portion
                const labelX = canvas.width / 2 + (Math.min(canvas.width / 2, canvas.height / 4) / 2) * Math.cos(startAngle + sliceAngle / 2);
                const labelY = canvas.height / 2 + (Math.min(canvas.width / 2, canvas.height / 4) / 2) * Math.sin(startAngle + sliceAngle / 2);
                content.fillStyle = "white";
                content.font = "14px Arial";
                content.fillText(labels[i], labelX, labelY);

                startAngle += sliceAngle; // Ajuster l'angle de départ pour la prochaine portion
            }
        }

        // Si aucune partie n'est jouée, dessiner un cercle rempli de blanc
        if (totalGames === 0) {
            drawFilledWhiteCircle('myCanvas');
        } else {
            // Sinon, dessiner le diagramme circulaire
            drawPieChart('myCanvas', data, colors, labels);
        }
    }

    // Appeler la fonction pour créer le diagramme
    createPieChart(wins, losse, totalGames);




    const UserStatsContener = document.createElement('div');
    UserStatsContener.className = 'UserStatsContener w-100 d-flex align-items-end p-2';
    ContentuserStatsProfile.appendChild(UserStatsContener);

    const UserStats = document.createElement('div');
    UserStats.className = 'UserStats w-100  d-flex flex-column align-items-center'; // Utiliser flex-column pour empiler les éléments
    UserStatsContener.appendChild(UserStats);

    const ContenerPointTaken = document.createElement('div');
    ContenerPointTaken.className = 'ContenerPointTaken  d-flex justify-content-center align-items-center w-100';
    UserStats.appendChild(ContenerPointTaken);

    // Créer un titre pour les défaites
    const TitlePointTaken = document.createElement('p');
    TitlePointTaken.className = 'ProgressText TitlePointTaken mb-2 d-flex align-items-center'; // Ajout d'une marge en bas
    TitlePointTaken.textContent = 'Point Taken: 36';
    ContenerPointTaken.appendChild(TitlePointTaken);

    const ContenerPointGiven = document.createElement('div');
    ContenerPointGiven.className = 'ContenerPointGiven d-flex justify-content-center align-items-center w-100';
    UserStats.appendChild(ContenerPointGiven);

    // Créer un titre pour les défaites
    const TitlePointGiven = document.createElement('p');
    TitlePointGiven.className = 'ProgressText TitlePointGiven mb-2 d-flex align-items-center';
    TitlePointGiven.textContent = 'Point Given: 49';
    ContenerPointGiven.appendChild(TitlePointGiven);

    const ContenerNbGame = document.createElement('div');
    ContenerNbGame.className = ' ContenerNbGame d-flex justify-content-center align-items-center w-100';
    UserStats.appendChild(ContenerNbGame);

    // Créer un titre pour les défaites
    const TitleNbGame = document.createElement('p');
    TitleNbGame.className = 'ProgressText TitleNbGame mb-2 d-flex align-items-center';
    TitleNbGame.textContent = 'Games: 84';
    ContenerNbGame.appendChild(TitleNbGame);

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
