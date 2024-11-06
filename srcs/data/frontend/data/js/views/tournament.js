import { navigationBar } from './navigation.js';
import { pongView, inGame, setInGame } from './pong.js';

export let currentPlayer = null;

export function tournamentView(container) {

    // container.innerHTML = '';

    // const div = document.createElement('div');
    // div.className = 'd-flex h-100';
    // container.appendChild(div);


    // const navBarContainer = navigationBar(container);
    // div.appendChild(navBarContainer);

    let tournamentContainer = container || document.getElementById('tournament-container');

    if (!tournamentContainer) {
        // Créer dynamiquement le conteneur si non existant
        tournamentContainer = document.createElement('div');
        tournamentContainer.id = 'tournament-container';

        // Ajouter le conteneur au body (ou à un autre élément existant si le paramètre n'est pas fourni)
        document.body.appendChild(tournamentContainer);
    }

    // loadPongCSS();  // CSS

    // Appliquer des styles pour centrer le conteneur
    tournamentContainer.style.display = 'flex';
    tournamentContainer.style.flexDirection = 'column';
    // tournamentContainer.style.alignItems = 'center';
    tournamentContainer.style.justifyContent = 'center';
    tournamentContainer.style.height = '100vh'; // S'assurer que le conteneur prend toute la hauteur de l'écran

    // Effacer tout contenu existant
    tournamentContainer.innerHTML = '';

    // Ajouter le titre du tournoi
    const title = document.createElement('h2');
    title.innerText = 'Tournament';
    title.style.textAlign = 'center'; // Centrer le titre
    tournamentContainer.appendChild(title);

    // Créer une liste pour afficher les joueurs
    const playerList = document.createElement('ul');
    playerList.id = 'player-list';
    playerList.style.listStyleType = 'none'; // Enlever les puces de la liste
    playerList.style.padding = '0';
    playerList.style.textAlign = 'center'; // Centrer la liste des joueurs

    for (let i = 0; i < 4; i++) {
        const playerSlot = document.createElement('li');
        playerSlot.innerText = `Player ${i + 1}: Waiting...`;
        playerSlot.id = `player-${i + 1}`;
        playerSlot.style.marginBottom = '10px'; // Espacement entre les joueurs
        playerList.appendChild(playerSlot);
    }

    tournamentContainer.appendChild(playerList);

    // Connexion WebSocket
    const tournamentSocket = new WebSocket(`wss://${window.location.host}/ws/tournament/`);

    tournamentSocket.onopen = function(event) {
        console.log('Connected to the tournament WebSocket');
    };
    setInGame(true);
    tournamentSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log("Received message from tournament WebSocket:", data);

        if(data.action_type === 'update_player_list') {
            currentPlayer = data.current_player;
            updatePlayerList(data);
        }
        if(data.action_type === 'start_tournament') {
            startTournament();
        }
        if(data.action_type === 'show_game') {
            startPongView();
        }
    };

    // Gérer la fermeture de la connexion WebSocket
    tournamentSocket.onclose = function(event) {
        setInGame(false);
        console.log('Tournament WebSocket closed.');
    };

    // Gérer les erreurs de la WebSocket
    tournamentSocket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    // Fonction pour mettre à jour la liste des joueurs
    function updatePlayerList(data) {
        const players = data.players; // Accéder à la liste des joueurs dans l'objet data
        console.log("players = ", players);
        for (let i = 0; i < 4; i++) {
            const playerSlot = document.getElementById(`player-${i + 1}`);
            if (playerSlot) {
                // Vérifiez si le joueur existe avant d'accéder à son nom
                playerSlot.innerText = `Player ${i + 1}: ${players[i] ? players[i].nickname : 'Waiting...'}`;
            }
        }
    }

    // Fonction pour démarrer le tournoi qui affiche "Tournament started!" en rouge après le nom des joueurs
    function startTournament() {
        console.log("Tournament started!");

        // Sélectionner tous les slots de joueurs
        const playerSlots = document.querySelectorAll('#player-list li');

        // Pour chaque slot, appliquer le style sans changer la couleur
        playerSlots.forEach(playerSlot => {
            playerSlot.style.fontWeight = 'bold';  // Mettre en gras le nom du joueur
        });

        // Créer un nouvel élément pour le message
        const messageElement = document.createElement('p');
        messageElement.textContent = "Tournament started!";
        messageElement.style.color = 'red';  // Appliquer la couleur rouge
        messageElement.style.fontWeight = 'bold'; // Mettre le message en gras si souhaité

        // Ajouter le message après la liste des joueurs
        const playerListContainer = document.getElementById('player-list');
        playerListContainer.appendChild(messageElement);
    }

    // Fonction pour démarrer la vue Pong
    function startPongView() {
        console.log("Starting Pong view");
        pongView(tournamentContainer, tournamentSocket);
    }
}

// Fonction pour afficher la vue de fin de tournoi avec le ranking final
export function endOfTournamentView(container, ranking) {

    let tournamentContainer = container || document.getElementById('tournament-container');

    if (!tournamentContainer) {
        tournamentContainer = document.createElement('div');
        tournamentContainer.id = 'tournament-container';
        document.body.appendChild(tournamentContainer);
    }
    tournamentContainer.innerHTML = '';

    // loadPongCSS();

    const title = document.createElement('h2');
    title.textContent = "Final Ranking";
    title.classList.add('text-center', 'my-4');
    tournamentContainer.appendChild(title);

    const rankingList = document.createElement('ol');
    rankingList.classList.add('ranking-list');
    tournamentContainer.appendChild(rankingList);

    const players = [
        { position: '1st', name: ranking.first },
        { position: '2nd', name: ranking.second },
        { position: '3rd', name: ranking.third },
        { position: '4th', name: ranking.fourth }
    ];

    players.forEach((player, index) => {
        setTimeout(() => {
            const listItem = document.createElement('li');
            listItem.textContent = `${player.position} : ${player.name}`;
            listItem.classList.add('ranking-item');
            if (player.position === '1st') {
                listItem.classList.add('first-place');
            }
            rankingList.appendChild(listItem);
        }, index * 1000);
    });
}

// CSS Pong
function loadPongCSS() {
    const style = document.createElement('style');
    style.textContent = `

    body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        color: white;
    }

    h2, ul, li {
        color: white;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    li {
        padding: 5px;
    }

    /* Styles spécifiques pour le canvas */
    .canvas {
        max-width: 100%;
        height: auto;
        border-style: groove;
        border-color: black;
    }

    /* Styles spécifiques pour la vue de fin de tournoi */
    .ranking-list {
        font-size: 1.2em;
        list-style-type: none;
        padding: 0;
        text-align: center;
    }

    .ranking-list li {
        margin: 10px 0;
    }

    /* Style spécial pour le premier joueur */
    .first-place {
        font-size: 2em;
        font-weight: bold;
        color: yellow;
    }
    `;
    document.head.appendChild(style);
}
