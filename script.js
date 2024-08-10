let score = 0;
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const gameArea = document.getElementById('gameArea');

// Fonction pour déplacer la cible à une position aléatoire
function moveTarget() {
    const gameAreaRect = gameArea.getBoundingClientRect();
    const maxX = gameAreaRect.width - target.offsetWidth;
    const maxY = gameAreaRect.height - target.offsetHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

// Fonction appelée lorsque le joueur clique sur la cible
function clickTarget() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    moveTarget();
}

// Ajouter un écouteur d'événement au clic sur la cible
target.addEventListener('click', clickTarget);

// Déplacer la cible initialement pour commencer le jeu
moveTarget();
