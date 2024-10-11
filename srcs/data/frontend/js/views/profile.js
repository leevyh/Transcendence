import { navigationBar } from './navigation.js';
import { notifications } from './notifications.js';
import { getCookie } from './utils.js';

// async function fetchUserStats() {
//     const response = await fetch(`/api/stats/`, {  // URL de ton API pour récupérer les statistiques
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//             'X-CSRFToken': getCookie('csrftoken'),
//         },
//     });

//     if (response.status === 200) {
//         return response.json();  // Convertit la réponse en JSON si tout va bien
//     } else if (response.status === 307) {
//         localStorage.removeItem('token');
//         await fetch('/api/logout/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': getCookie('csrftoken'),
//             },
//         });
//         navigateTo('/');
//         return null;
//     } else {
//         console.error('Error:', response);
//         return null;
//     }
// }


export async function profileView(container) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const userData = await fetch(`/api/settings/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.status === 200) {
            return response.json(); // Retourne les données si le statut est 200
        } else {
            console.error('Error:', response);
            return null; // Gérer les autres erreurs sans faire de logout
        }
    })
    .then(data => {
        if (!data) {
           console.error('No data received');
           return null;
        }
        // Retourne les données utilisateur
        return {
            username: data.username,
            nickname: data.nickname,
            email: data.email,
            language: data.language,
            font_size: data.font_size,
            theme: data.dark_mode,
            avatar: data.avatar,
        };
    })
    .catch(error => {
        console.error('Failed to fetch user data:', error);
        return null;
    });

    // Si aucune donnée n'a été récupérée, on arrête là
    if (!userData) {
        return;
    }
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
    imgAv.className = 'imgAv rounded-circle';
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
    img2Av.className = 'img2Av rounded-circle';
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
    img3Av.className = 'img3Av rounded-circle';
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
    TitleStatsProfile.textContent = `${userData.nickname}'s Stats`;
    HeaderStatsProfile.appendChild(TitleStatsProfile);

    const ContentuserStatsProfile = document.createElement('div');
    ContentuserStatsProfile.className = 'ContentuserStatsProfile d-flex justify-content-center flex-column w-100 h-75';
    userStatsProfile.appendChild(ContentuserStatsProfile);

    const CharWinRateContener = document.createElement('div');
    CharWinRateContener.className = 'CharWinRateContener d-flex justify-content-center align-items-center  w-100';
    ContentuserStatsProfile.appendChild(CharWinRateContener);

    const wins = 20;
    const losse = 10;
    const totalGames = wins + losse;

    function createPieChart(wins, losse, totalGames) {

        const canvas = document.createElement('canvas');
        canvas.id = 'myCanvas';
        canvas.className = 'h-100 p-1';
        CharWinRateContener.appendChild(canvas);

        const data = [wins, losse]; // Victoires et pertes
        const colors = ["rgba(0, 123, 255, 0.3)", "rgba(255, 0, 0, 0.3)"]; // Vert pour victoires, Rouge pour pertes
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

                content.fillStyle = colors[i];
                content.fill();

                const labelX = canvas.width / 2 + (Math.min(canvas.width / 2, canvas.height / 4) / 2) * Math.cos(startAngle + sliceAngle / 2);
                const labelY = canvas.height / 2 + (Math.min(canvas.width / 2, canvas.height / 4) / 2) * Math.sin(startAngle + sliceAngle / 2);
                content.fillStyle = "white";
                content.font = "14px Arial";
                content.fillText(labels[i], labelX, labelY);

                startAngle += sliceAngle;
            }
        }
        if (totalGames === 0) {
            drawFilledWhiteCircle('myCanvas');
        } else {
            drawPieChart('myCanvas', data, colors, labels);
        }
    }

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


    function createGameHistory(player1Avatar, player1Name, score, player2Avatar, player2Name) {
        // Création de ContenerHistoriqueGame
        const ContenerHistoriqueGame = document.createElement('div');
        ContenerHistoriqueGame.className = 'ContenerHistoriqueGame d-flex flex-row w-100';

        // Conteneur pour le premier joueur (player 1)
        const ContenerYourAvatar = document.createElement('div');
        ContenerYourAvatar.className = 'ContenerYourAvatar w-25 d-flex justify-content-center align-items-center flex-column';
        ContenerHistoriqueGame.appendChild(ContenerYourAvatar);

        const YouravatarImage = document.createElement('img');
        YouravatarImage.src = player1Avatar;
        YouravatarImage.alt = 'YouravatarImage';
        YouravatarImage.className = 'YouravatarImage rounded-circle';
        YouravatarImage.style.width = '90px';
        YouravatarImage.style.height = '90px';
        ContenerYourAvatar.appendChild(YouravatarImage);

        const YourUsername = document.createElement('p');
        YourUsername.className = 'YourUsername w-100 h-25 m-0 pt-1';
        YourUsername.textContent = player1Name;
        ContenerYourAvatar.appendChild(YourUsername);

        // Conteneur pour le score de la partie
        const ContenerScore = document.createElement('div');
        ContenerScore.className = 'ContenerScore w-50 d-flex justify-content-center align-items-center';
        ContenerHistoriqueGame.appendChild(ContenerScore);

        const ScoreGame = document.createElement('p');
        ScoreGame.className = 'ScoreGame h-100 w-100 m-0 d-flex justify-content-center align-items-center fs-2';
        ScoreGame.textContent = score;
        ContenerScore.appendChild(ScoreGame);

        // Conteneur pour le deuxième joueur (player 2)
        const ContenerHisAvatar = document.createElement('div');
        ContenerHisAvatar.className = 'ContenerHisAvatar w-25 d-flex justify-content-center align-items-center flex-column';
        ContenerHistoriqueGame.appendChild(ContenerHisAvatar);

        const HisavatarImage = document.createElement('img');
        HisavatarImage.src = player2Avatar;
        HisavatarImage.alt = 'HisavatarImage';
        HisavatarImage.className = 'HisavatarImage rounded-circle';
        HisavatarImage.style.width = '90px';
        HisavatarImage.style.height = '90px';
        ContenerHisAvatar.appendChild(HisavatarImage);

        const HisUsername = document.createElement('p');
        HisUsername.className = 'HisUsername w-100 h-25 m-0 pt-1';
        HisUsername.textContent = player2Name;
        ContenerHisAvatar.appendChild(HisUsername);

        // Comparaison des scores
        const scores = score.split('-'); // Séparer le score par le tiret
        const score1 = parseInt(scores[0], 10); // Convertir en nombre la première partie
        const score2 = parseInt(scores[1], 10); // Convertir en nombre la deuxième partie

        // Appliquer le style en fonction du score
        if (score1 > score2) {
            // Si le score du joueur 1 est plus grand, changer le background avec une opacité
            ContenerHistoriqueGame.style.backgroundColor = 'rgba(0, 123, 255, 0.3)'; // Bleu clair avec une opacité de 0.3
        } else if (score2 > score1) {
            // Si le score du joueur 2 est plus grand, tu peux aussi changer le background (facultatif)
            ContenerHistoriqueGame.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // Rouge clair avec une opacité de 0.3
        }

        // Retourne l'élément créé
        return ContenerHistoriqueGame;
    }

    // Utilisation de la fonction pour ajouter plusieurs historiques de jeu
    const ContainerHistorical = document.createElement('div');
    ContainerHistorical.className = 'ContainerHistorical flex-fill pt-3';
    mainDiv.appendChild(ContainerHistorical);

    const historical = document.createElement('div');
    historical.className = 'historical h-100';
    ContainerHistorical.appendChild(historical);

    // Exemple : Générer 3 parties
    historical.appendChild(createGameHistory(`data:image/png;base64, ${userData.avatar}`, `${userData.nickname}`, '14-22', '/js/img/download.jpeg', 'Player 2'));
    // historical.appendChild(createGameHistory('/js/img/avatar3.jpeg', 'Player 3', '10-18', '/js/img/avatar4.jpeg', 'Player 4'));
    // historical.appendChild(createGameHistory('/js/img/avatar5.jpeg', 'Player 5', '20-17', '/js/img/avatar6.jpeg', 'Player 6'));

    // try {
    //     const stats = await fetchUserStats();  // Appel à l'API pour récupérer les statistiques
    //     if (stats) {

    //         console.log('Nombre de parties jouées:', stats.nb_games);
    //         console.log('Nombre de victoires:', stats.nb_wins);
    //         console.log('Nombre de défaites:', stats.nb_losses);
    //         console.log('Taux de victoire (win-rate):', stats.win_rate);
    //         console.log('Points pris:', stats.nb_point_taken);
    //         console.log('Points donnés:', stats.nb_point_given);
    //         //console.log('stats recup');
    //         // Utilisation des données récupérées pour mettre à jour la vue
    //         const gamesPlayedElement = document.createElement('p');
    //         gamesPlayedElement.textContent = `Games Played: ${stats.nb_games}`;
    //         usersContainer.appendChild(gamesPlayedElement);

    //         const gamesWonElement = document.createElement('p');
    //         gamesWonElement.textContent = `Games Won: ${stats.nb_wins}`;
    //         usersContainer.appendChild(gamesWonElement);

    //         // Afficher d'autres statistiques si besoin
    //         // Par exemple, win rate, points pris, points donnés, etc.
    //     }
    // } catch (error) {
    //     console.error('Error fetching user stats:', error);
    // }

    const notifications_div = await notifications();
    div.appendChild(notifications_div);


}
