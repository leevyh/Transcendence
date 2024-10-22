import { navigationBar } from './navigation.js';
import { notifications } from './notifications.js';


export async function leaderboardView(container) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'd-flex h-100';
    container.appendChild(div);

    const navBarContainer = await navigationBar(container);
    div.appendChild(navBarContainer);

    const mainDiv = document.createElement('div');
    mainDiv.className = 'd-flex flex-grow-1 m-4 flex-column';
    div.appendChild(mainDiv);

    const ContentPosition = document.createElement('div');
    ContentPosition.className = 'ContentPosition d-flex flex-row p-3 w-100 mb-2';
    ContentPosition.style.height = "40%";
    ContentPosition.style.backgroundColor = '#435574';
    mainDiv.appendChild(ContentPosition);

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
    TextFirstPos.style.color = '#f5b041';
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
    FirstUserName.className = 'thirdUserName m-0 text-center fs-6 d-none d-sm-block';
    FirstUserName.textContent = 'firstname';
    FirstUserName.style.color = '#f5b041';
    firstplaceContainer.appendChild(FirstUserName);

    const otherplace = document.createElement('div');
    otherplace.className = 'otherplace w-100 d-flex flex-row ';
    podiumContener.appendChild(otherplace);

    const secplace = document.createElement('div');
    secplace.className = 'secplace d-flex justify-content-center align-items-start flex-column w-50 h-100';
    otherplace.appendChild(secplace);

    const secplaceContainer = document.createElement('div');
    secplaceContainer.className = 'd-flex flex-column justify-content-center align-items-center w-100 h-100';
    secplace.appendChild(secplaceContainer);

    const TextSecPos = document.createElement('h6');
    TextSecPos.className = 'TextSecPos text-center w-100 mb-2 d-none d-sm-block';
    TextSecPos.textContent = '2nd';
    TextSecPos.style.margin = '0';
    TextSecPos.style.color = '#95a5a6';
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
    SecUserName.className = 'SecUserName m-0 text-center fs-6 d-none d-md-block';
    SecUserName.textContent = 'secondname';
    SecUserName.style.color = '#95a5a6';
    secplaceContainer.appendChild(SecUserName);

    const thirdplace = document.createElement('div');
    thirdplace.className = 'thirdplace d-flex justify-content-center align-items-start flex-column w-50 h-100 ';  // Ajout de overflow-hidden ici
    otherplace.appendChild(thirdplace);

    const thirdplaceContainer = document.createElement('div');
    thirdplaceContainer.className = 'd-flex flex-column justify-content-center align-items-center w-100 h-100';
    thirdplace.appendChild(thirdplaceContainer);

    const TextThirdPos = document.createElement('h6');
    TextThirdPos.className = 'TextThirdPos text-center w-100 mb-2 d-none d-sm-block';
    TextThirdPos.textContent = '3rd';
    TextThirdPos.style.margin = '0';
    TextThirdPos.style.color = '#6e2c00 ';
    thirdplaceContainer.appendChild(TextThirdPos);

    const imgContainerThirdPos = document.createElement('div');
    imgContainerThirdPos.className = 'img-container d-flex justify-content-center align-items-start w-100 h-50 ';
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
    thirdUserName.className = 'thirdUserName m-0 text-center fs-6 d-none d-md-block';
    thirdUserName.textContent = 'thirdname';
    thirdUserName.style.color = '#6e2c00';
    thirdplaceContainer.appendChild(thirdUserName);

    const ContenerListLead = document.createElement('div');
    ContenerListLead.className = 'ContenerListLead d-flex flex-column p-3  w-100 overflow-y-auto';
    ContenerListLead.style.backgroundColor = '#435574';
    ContenerListLead.style.height = "60%";
    mainDiv.appendChild(ContenerListLead);

    const ContenerRankingPos = document.createElement('div');
    ContenerRankingPos.className = 'ContenerRankingPos d-flex justify-content-between flex-row align-items-center w-100 mb-1 overflow-x-hidden overflow-y-hidden';
    ContenerRankingPos.style.position = 'relative';
    ContenerRankingPos.style.height = '50px';
    ContenerRankingPos.style.backgroundColor = '#2874a6';
    ContenerListLead.appendChild(ContenerRankingPos);

    const HeaderRankPos = document.createElement('div');
    HeaderRankPos.classList = 'HeaderRankPos d-flex align-items-center h-100 p-1 mb-2 d-none d-md-block';
    HeaderRankPos.style.color = '#F4ED37';
    ContenerRankingPos.appendChild(HeaderRankPos);

    const RankPosHash = document.createElement('h6');
    RankPosHash.className = 'RankPosHash  fst-italic py-3 m-0';
    RankPosHash.textContent = '#';
    RankPosHash.style.display = 'inline-block';
    HeaderRankPos.appendChild(RankPosHash);

    const RankingPosition = document.createElement('h6');
    RankingPosition.className = 'RankingPosition py-3 m-0';
    RankingPosition.textContent = '58';

    RankingPosition.style.display = 'inline-block';
    HeaderRankPos.appendChild(RankingPosition);


    const RankPosUsername = document.createElement('div');
    RankPosUsername.classList = 'RankPosUsername d-flex align-items-center h-100 p-1 overflow-x-hidden';
    RankPosUsername.style.position = 'absolute'; // Pour centrer l'élément de manière absolue
    RankPosUsername.style.left = '50%'; // Place l'élément à 50% de la largeur du parent
    RankPosUsername.style.transform = 'translateX(-50%)';
    RankPosUsername.textContent = "Username";
    ContenerRankingPos.appendChild(RankPosUsername);

    const RankPosScore = document.createElement('div');
    RankPosScore.classList = 'RankPosScore d-flex align-items-center h-100 p-1 mt-3 d-none d-lg-block';
    RankPosScore.textContent = "17456";
    ContenerRankingPos.appendChild(RankPosScore);

    // const ContenerListLeadBis = document.createElement('div');
    // ContenerListLeadBis.className = 'ContenerListLeadBis d-flex  flex-row p-3 h-50 w-100 ';
    // mainDiv.appendChild(ContenerListLeadBis);

    const ContenerRankingPosBis = document.createElement('div');
    ContenerRankingPosBis.className = 'ContenerRankingPos d-flex justify-content-between flex-row align-items-center w-100 overflow-x-hidden overflow-y-hidden';
    ContenerRankingPosBis.style.position = 'relative'; // Ajouter position relative
    ContenerRankingPosBis.style.height = '50px';
    ContenerRankingPosBis.style.backgroundColor = '#2874a6';
    ContenerListLead.appendChild(ContenerRankingPosBis);

    const HeaderRankPosBis = document.createElement('div');
    HeaderRankPosBis.classList = 'HeaderRankPos d-flex flex-row align-items-center p-1 mb-2  h-100 p-1 d-none d-md-block';
    HeaderRankPosBis.style.color = '#F4ED37';
    ContenerRankingPosBis.appendChild(HeaderRankPosBis);

    const RankPosHashBis = document.createElement('h6');
    RankPosHashBis.className = 'RankPosHash fst-italic py-3 m-0';
    RankPosHashBis.textContent = '#';
    RankPosHashBis.style.display = 'inline-block';
    HeaderRankPosBis.appendChild(RankPosHashBis);

    const RankingPositionBis = document.createElement('h6');
    RankingPositionBis.className = 'RankingPosition py-3 m-0';
    RankingPositionBis.textContent = '581';
    RankingPositionBis.style.display = 'inline-block';
    HeaderRankPosBis.appendChild(RankingPositionBis);

    const RankPosUsernameBis = document.createElement('div');
    RankPosUsernameBis.classList = 'RankPosUsername d-flex align-items-center h-100 p-1 ';
    RankPosUsernameBis.style.position = 'absolute'; // Pour centrer l'élément de manière absolue
    RankPosUsernameBis.style.left = '50%'; // Place l'élément à 50% de la largeur du parent
    RankPosUsernameBis.style.transform = 'translateX(-50%)';
    RankPosUsernameBis.textContent = "Usernamedsdas";
    ContenerRankingPosBis.appendChild(RankPosUsernameBis);

    const RankPosScoreBis = document.createElement('div');
    RankPosScoreBis.classList = 'RankPosScore d-flex align-items-center h-100 p-1 mt-3 d-none d-lg-block';
    RankPosScoreBis.textContent = "445417456";

    ContenerRankingPosBis.appendChild(RankPosScoreBis);

    const notifications_div = await notifications();
    div.appendChild(notifications_div);
}
