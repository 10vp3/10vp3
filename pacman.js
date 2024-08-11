const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 40;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

let pacman = {
    x: tileSize,
    y: tileSize,
    dx: tileSize,
    dy: 0,
    radius: tileSize / 3,
    direction: 'right',
    mouthOpen: true
};

let ghosts = [
    { x: 5 * tileSize, y: 5 * tileSize, dx: tileSize, dy: 0, color: 'red' },
    { x: 10 * tileSize, y: 5 * tileSize, dx: -tileSize, dy: 0, color: 'pink' }
];

let pellets = [];
let score = 0;

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
];

function drawPacman() {
    ctx.beginPath();
    ctx.arc(pacman.x + pacman.radius, pacman.y + pacman.radius, pacman.radius, 
        pacman.mouthOpen ? 0.2 * Math.PI : 0, 
        pacman.mouthOpen ? 1.8 * Math.PI : 2 * Math.PI
    );
    ctx.lineTo(pacman.x + pacman.radius, pacman.y + pacman.radius);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(ghost.x + tileSize / 2, ghost.y + tileSize / 2, tileSize / 2, 0, 2 * Math.PI);
        ctx.fillStyle = ghost.color;
        ctx.fill();
        ctx.closePath();
    });
}

function drawMap() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let tile = map[row][col];
            switch (tile) {
                case '-':
                    ctx.fillStyle = '#555';
                    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                    break;
                case '|':
                    ctx.fillStyle = '#555';
                    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                    break;
                case '.':
                    ctx.beginPath();
                    ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = 'white';
                    ctx.fill();
                    ctx.closePath();
                    pellets.push({ x: col * tileSize + tileSize / 2, y: row * tileSize + tileSize / 2 });
                    break;
                case 'b':
                    ctx.fillStyle = '#0000FF';
                    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                    break;
            }
        }
    }
}

function update() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    // Collision with walls
    let col = Math.floor(pacman.x / tileSize);
    let row = Math.floor(pacman.y / tileSize);
    if (map[row] && map[row][col] === '-' || map[row][col] === '|') {
        pacman.x -= pacman.dx;
        pacman.y -= pacman.dy;
    }

    // Wrap around canvas
    if (pacman.x < 0) pacman.x = canvas.width - tileSize;
    if (pacman.y < 0) pacman.y = canvas.height - tileSize;
    if (pacman.x >= canvas.width) pacman.x = 0;
    if (pacman.y >= canvas.height) pacman.y = 0;

    // Collect pellets
    pellets = pellets.filter(pellet => {
        if (Math.hypot(pacman.x + pacman.radius - pellet.x, pacman.y + pacman.radius - pellet.y) < pacman.radius) {
            score += 10;
            return false; // Remove pellet
        }
        return true;
    });

    // Update ghosts
    ghosts.forEach(ghost => {
        ghost.x += ghost.dx;
        ghost.y += ghost.dy;

        // Simple ghost movement: move left/right within the boundaries
        if (ghost.x < 0 || ghost.x >= canvas.width) ghost.dx *= -1;
        if (ghost.y < 0 || ghost.y >= canvas.height) ghost.dy *= -1;
    });

    // Check collision with ghosts
    ghosts.forEach(ghost => {
        if (Math.hypot(pacman.x + pacman.radius - (ghost.x + tileSize / 2), pacman.y + pacman.radius - (ghost.y + tileSize / 2)) < pacman.radius + tileSize / 2) {
            alert('Game Over! Your score: ' + score);
            resetGame();
        }
    });

    pacman.mouthOpen = !pacman.mouthOpen;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

function changeDirection(direction) {
    switch (direction) {
        case 'up':
            pacman.dx = 0;
            pacman.dy = -tileSize;
            pacman.direction = 'up';
            break;
        case 'down':
            pacman.dx = 0;
            pacman.dy = tileSize;
            pacman.direction = 'down';
            break;
        case 'left':
            pacman.dx = -tileSize;
            pacman.dy = 0;
            pacman.direction = 'left';
            break;
        case 'right':
            pacman.dx = tileSize;
            pacman.dy = 0;
            pacman.direction = 'right';
            break;
    }
}

// Reset the game
function resetGame() {
    pacman.x = tileSize;
    pacman.y = tileSize;
    pacman.dx = tileSize;
    pacman.dy = 0;
    pacman.direction = 'right';
    pacman.mouthOpen = true;
    ghosts = [
        { x: 5 * tileSize, y: 5 * tileSize, dx: tileSize, dy: 0, color: 'red' },
        { x: 10 * tileSize, y: 5 * tileSize, dx: -tileSize, dy: 0, color: 'pink' }
    ];
    pellets = [];
    score = 0;
    drawMap(); // Re-draw pellets
}

// Keyboard Controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            changeDirection('up');
            break;
        case 'ArrowDown':
            changeDirection('down');
            break;
        case 'ArrowLeft':
            changeDirection('left');
            break;
        case 'ArrowRight':
            changeDirection('right');
            break;
    }
});

// Touch Controls
document.getElementById('up').addEventListener('click', () => changeDirection('up'));
document.getElementById('down').addEventListener('click', () => changeDirection('down'));
document.getElementById('left').addEventListener('click', () => changeDirection('left'));
document.getElementById('right').addEventListener('click', () => changeDirection('right'));

drawMap(); // Initial drawing of the map
animate();
