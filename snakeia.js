document.addEventListener('DOMContentLoaded', (event) => {
    const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('bestScore');
    const globalBestScoreDisplay = document.getElementById('globalBestScore');
    const startBtn = document.getElementById('startBtn');
    const gridSize = 20; // Taille de chaque cellule du serpent et de la nourriture
    const gridPadding = 1;
    const maxGridX = (gameArea.clientWidth / gridSize) - gridPadding * 2;
    const maxGridY = (gameArea.clientHeight / gridSize) - gridPadding * 2;
    let snake, direction, food, score, gameLoop;

    let playerName = prompt("Entrez votre nom :") || "Joueur";
    let bestScore = parseInt(localStorage.getItem(`${playerName}_bestScore`)) || 0;
    let bestPlayer = localStorage.getItem("bestPlayer") || "";
    let globalBestScore = parseInt(localStorage.getItem("globalBestScore")) || 0;

    bestScoreDisplay.textContent = `Meilleur score actuel: ${bestScore} - ${playerName}`;
    globalBestScoreDisplay.textContent = `Meilleur score global: ${globalBestScore} - ${bestPlayer}`;

    function initGame() {
        snake = [{ x: 200, y: 200 }];
        direction = { x: 0, y: 0 };
        food = { x: 0, y: 0 };
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        createFood();
        drawSnake();
    }

    function createFood() {
        food.x = (Math.floor(Math.random() * maxGridX) + gridPadding) * gridSize;
        food.y = (Math.floor(Math.random() * maxGridY) + gridPadding) * gridSize;
    }

    function drawFood() {
        const foodElement = document.createElement('div');
        foodElement.style.left = `${food.x}px`;
        foodElement.style.top = `${food.y}px`;
        foodElement.classList.add('food');
        gameArea.appendChild(foodElement);
    }

    function moveSnake() {
        const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            createFood();
        } else {
            snake.pop();
        }
    }

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

    function checkCollision() {
        const head = snake[0];
        if (
            head.x < 0 || head.x >= gameArea.clientWidth ||
            head.y < 0 || head.y >= gameArea.clientHeight ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            clearInterval(gameLoop);

            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem(`${playerName}_bestScore`, bestScore);
                bestScoreDisplay.textContent = `Meilleur score actuel: ${bestScore} - ${playerName}`;
                
                if (score > globalBestScore) {
                    globalBestScore = score;
                    localStorage.setItem("globalBestScore", globalBestScore);
                    localStorage.setItem("bestPlayer", playerName);
                    globalBestScoreDisplay.textContent = `Meilleur score global: ${globalBestScore} - ${playerName}`;
                }
            }

            alert('Game Over! Votre score est: ' + score);
            startBtn.textContent = "Rejouer";
            startBtn.style.display = "block";
        }
    }

    function game() {
        aiMove();
        moveSnake();
        drawSnake();
        checkCollision();
    }

    function startGame() {
        initGame();
        startBtn.style.display = "none";
        gameLoop = setInterval(game, 100);
    }

    document.getElementById('up').addEventListener('click', () => handleTouchControl('up'));
    document.getElementById('left').addEventListener('click', () => handleTouchControl('left'));
    document.getElementById('down').addEventListener('click', () => handleTouchControl('down'));
    document.getElementById('right').addEventListener('click', () => handleTouchControl('right'));

    document.addEventListener('keydown', changeDirection);
    startBtn.addEventListener('click', startGame);

    startBtn.style.display = "block";
});

function aiMove() {
    const head = snake[0];
    let bestMove = null;
    let minDistance = Infinity;

    const moves = [
        { direction: { x: -gridSize, y: 0 }, key: 37 }, // Gauche
        { direction: { x: gridSize, y: 0 }, key: 39 },  // Droite
        { direction: { x: 0, y: -gridSize }, key: 38 }, // Haut
        { direction: { x: 0, y: gridSize }, key: 40 }   // Bas
    ];

    moves.forEach(move => {
        const newHead = { x: head.x + move.direction.x, y: head.y + move.direction.y };
        const distance = Math.hypot(newHead.x - food.x, newHead.y - food.y);

        if (distance < minDistance && isMoveSafe(newHead)) {
            minDistance = distance;
            bestMove = move;
        }
    });

    if (bestMove) {
        changeDirection({ keyCode: bestMove.key });
    }
}

function isMoveSafe(newHead) {
    return (
        newHead.x >= 0 && newHead.x < gameArea.clientWidth &&
        newHead.y >= 0 && newHead.y < gameArea.clientHeight &&
        !snake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)
    );
}
