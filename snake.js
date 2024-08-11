const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const gridSize = 10; //Vitesse du snake
let snake, direction, food, score, gameLoop;

// Initialiser le jeu
function initGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    food = { x: 0, y: 0 };
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    createFood();
    drawSnake();
}

// Générer une nouvelle position aléatoire pour la pomme
function createFood() {
    food.x = Math.floor(Math.random() * (gameArea.clientWidth / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (gameArea.clientHeight / gridSize)) * gridSize;
}

// Afficher la pomme dans la zone de jeu
function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    gameArea.appendChild(foodElement);
}

// Mettre à jour la position du serpent
function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(newHead);

    // Vérifier si le serpent mange la pomme
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        gridSize++;
        createFood();
    } else {
        snake.pop(); // Supprimer la queue si le serpent ne mange pas
    }
}

// Dessiner le serpent dans la zone de jeu
function drawSnake() {
    gameArea.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${segment.x}px`;
        snakeElement.style.top = `${segment.y}px`;
        snakeElement.classList.add('snake');
        gameArea.appendChild(snakeElement);
    });
    drawFood();
}

// Contrôler le serpent avec les touches du clavier
function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction.x === 0) {
        direction = { x: -gridSize, y: 0 }; // Gauche
    } else if (key === 38 && direction.y === 0) {
        direction = { x: 0, y: -gridSize }; // Haut
    } else if (key === 39 && direction.x === 0) {
        direction = { x: gridSize, y: 0 }; // Droite
    } else if (key === 40 && direction.y === 0) {
        direction = { x: 0, y: gridSize }; // Bas
    }
}

// Contrôler le serpent avec les boutons tactiles
function handleTouchControl(directionKey) {
    if (directionKey === 'left' && direction.x === 0) {
        direction = { x: -gridSize, y: 0 }; // Gauche
    } else if (directionKey === 'up' && direction.y === 0) {
        direction = { x: 0, y: -gridSize }; // Haut
    } else if (directionKey === 'right' && direction.x === 0) {
        direction = { x: gridSize, y: 0 }; // Droite
    } else if (directionKey === 'down' && direction.y === 0) {
        direction = { x: 0, y: gridSize }; // Bas
    }
}

// Vérifier si le serpent entre en collision avec les murs ou lui-même
function checkCollision() {
    const head = snake[0];
    if (
        head.x < 0 || head.x >= gameArea.clientWidth ||
        head.y < 0 || head.y >= gameArea.clientHeight ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameLoop);
        alert('Game Over! Votre score est: ' + score);
        startBtn.textContent = "Rejouer";
        startBtn.style.display = "block";
    }
}

// Boucle de jeu
function game() {
    moveSnake();
    drawSnake();
    checkCollision();
}

// Lancer la partie
function startGame() {
    initGame();
    startBtn.style.display = "none";
    gameLoop = setInterval(game, 100);
}

// Ajouter des événements pour les contrôles tactiles
document.getElementById('up').addEventListener('click', () => handleTouchControl('up'));
document.getElementById('left').addEventListener('click', () => handleTouchControl('left'));
document.getElementById('down').addEventListener('click', () => handleTouchControl('down'));
document.getElementById('right').addEventListener('click', () => handleTouchControl('right'));

document.addEventListener('keydown', changeDirection);
startBtn.addEventListener('click', startGame);

// Afficher le bouton "Commencer" au début
startBtn.style.display = "block";
