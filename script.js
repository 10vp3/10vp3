const pacman = document.getElementById('pacman');
const gameArea = document.getElementById('gameArea');
let pacmanX = 0;
let pacmanY = 0;
const stepSize = 10;
let direction = 'right';

function movePacman() {
    pacman.style.transform = `translate(${pacmanX}px, ${pacmanY}px) rotate(${getRotation()}deg)`;
}

function getRotation() {
    switch(direction) {
        case 'right': return 0;
        case 'down': return 90;
        case 'left': return 180;
        case 'up': return 270;
    }
}

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            if (pacmanY - stepSize >= 0) {
                pacmanY -= stepSize;
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (pacmanY + stepSize <= gameArea.clientHeight - pacman.clientHeight) {
                pacmanY += stepSize;
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (pacmanX - stepSize >= 0) {
                pacmanX -= stepSize;
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (pacmanX + stepSize <= gameArea.clientWidth - pacman.clientWidth) {
                pacmanX += stepSize;
                direction = 'right';
            }
            break;
    }
    movePacman();
});
