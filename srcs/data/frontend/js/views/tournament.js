import { navigationBar } from './navigation.js';
import { pongView } from './pong.js';

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

    loadPongCSS();  // CSS

    // Appliquer des styles pour centrer le conteneur
    tournamentContainer.style.display = 'flex';
    tournamentContainer.style.flexDirection = 'column';
    tournamentContainer.style.alignItems = 'center';
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
    const wsUrl = 'ws://' + window.location.host + '/ws/tournament/';
    const tournamentSocket = new WebSocket(wsUrl);

    tournamentSocket.onopen = function(event) {
        console.log('Connected to the tournament WebSocket');
    };

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


export function endOfTournamentView(container, data) {

    // // Vérifier si le container est fourni ou essayer de récupérer par l'ID
    // let endTournamentContainer = container || document.getElementById('end-tournament-container');

    // // Si le container n'existe pas, le créer
    // if (!endTournamentContainer) {
    //     endTournamentContainer = document.createElement('div');
    //     endTournamentContainer.id = 'end-tournament-container';
    //     document.body.appendChild(endTournamentContainer);  // L'ajouter au body
    // }
    // else {
    //     // Effacer tout contenu existant
    //     endTournamentContainer.innerHTML = '';
    // }

    // // Créer un titre
    // const title = document.createElement('h2');
    // title.textContent = 'Final rankings';
    // endTournamentContainer.appendChild(title);

    // // Créer une liste pour afficher les classements
    // const rankingList = document.createElement('ul');
    // rankingList.className = 'ranking-list';

    // // Utiliser les données de classement fournies dans l'événement WebSocket
    // const rankings = data.ranking;  // Récupérer les classements des données

    // rankings.forEach((player, index) => {
    //     const listItem = document.createElement('li');
    //     listItem.textContent = `${index + 1}. ${player}`;
    //     rankingList.appendChild(listItem);
    // });

    // endTournamentContainer.appendChild(rankingList);
}




// CSS Pong
function loadPongCSS() {
    const style = document.createElement('style');
    style.textContent = `

        body, h2, ul, li {
        color: white;
        }

		body {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			margin: 0;
		}

		ul {
			margin: 0;
			padding: 0;
			list-style-type: none;
		}

		li {
			padding: 5px;
		}

		.canvas {
			max-width: 100%;
			height: auto;
            border-style: groove;
            border-color: black;
		}
    `;
    document.head.appendChild(style);
}

