const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bullets = [];

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
    updateBullets();     // 👈 nuevo
    drawPlayer();
    drawBullets();       // 👈 nuevo
    requestAnimationFrame(gameLoop);
}


gameLoop();

// Controles
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.code === 'Space') shoot();
    if (e.key === 'ArrowLeft') player.movingLeft = true;
    if (e.key === 'ArrowRight') player.movingRight = true;
    
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') player.movingLeft = false;
    if (e.key === 'ArrowRight') player.movingRight = false;
});



function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 7,
        color: 'yellow'
    });
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function updateBullets() {
    bullets.forEach(bullet => bullet.y -= bullet.speed);

    // Eliminar los que salen de pantalla
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y + bullets[i].height < 0) {
            bullets.splice(i, 1);
        }
    }
}
