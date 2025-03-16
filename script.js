const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Nave del jugador
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    color: 'cyan',
    speed: 5,
    movingLeft: false,
    movingRight: false
};

// Dibujar la nave
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Limpiar canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Actualizar posición de la nave
function update() {
    if (player.movingLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.movingRight && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

// Bucle principal
function gameLoop() {
    clearCanvas();
    update();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

gameLoop();

// Controles
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.movingLeft = true;
    if (e.key === 'ArrowRight') player.movingRight = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') player.movingLeft = false;
    if (e.key === 'ArrowRight') player.movingRight = false;
});
