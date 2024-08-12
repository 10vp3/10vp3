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


function game() {
    aiMove(); // Ajoute cette ligne pour permettre à l'IA de prendre des décisions
    moveSnake();
    drawSnake();
    checkCollision();
}
