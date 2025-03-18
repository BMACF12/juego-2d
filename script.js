const sonidoDisparo = new Audio('assets/shoot.wav');
const sonidoExplosion = new Audio('assets/explosion.wav');
const sonidoGameOver = new Audio('assets/gameover.wav');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bullets = [];
const enemyBullets = [];
const enemies = [];
let highScore = localStorage.getItem('highScore') || 0;
let enemySpawnTimer = 0;
let nivel = 1;
let velocidadEnemigo = 2;
let spawnRate = 60; // menor = más enemigos
let enemyBulletSpeed = 4;
let playerBulletSpeed = 7; // puedes subir esto si lo necesitas

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
    if (gameOver) {
        mostrarGameOver();
        return;
    }

    clearCanvas();
    update();
    updateBullets();
    updateEnemies();
    updateEnemyBullets();         // 👈 nuevo

    drawPlayer();
    drawBullets();
    drawEnemies();
    drawEnemyBullets();          // 👈 nuevo

    checkCollisions();
    checkPlayerCollision();
    checkPlayerBulletCollision(); // 👈 nuevo

    enemySpawnTimer++;
    if (enemySpawnTimer > spawnRate) {
        spawnEnemy();
        enemySpawnTimer = 0;
    }

    requestAnimationFrame(gameLoop);
}

function iniciarJuego() {
    score = 0;
    vidas = 3;
    gameOver = false;
    enemies.length = 0;
    bullets.length = 0;
    updateScore();
    updateVidas();
    updateHighScore();
    gameLoop();
}


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
        speed: playerBulletSpeed,
        color: 'yellow'
    });
    sonidoDisparo.currentTime = 0;
    sonidoDisparo.play();
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

function spawnEnemy() {
    const size = 30;
    const x = Math.random() * (canvas.width - size);
    enemies.push({
        x: x,
        y: -size,
        width: size,
        height: size,
        speed: velocidadEnemigo,
        color: 'red'
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.y += enemy.speed;

        // Probabilidad de disparar (ajusta según dificultad)
        if (Math.random() < 0.005) {
            shootEnemy(enemy);
        }
    });

    // Eliminar los que salen
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
        }
    }
}

function checkCollisions() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
            const enemy = enemies[i];
            const bullet = bullets[j];

            const hit = (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            );

            if (hit) {
                sonidoExplosion.currentTime = 0;
                sonidoExplosion.play();
                enemies.splice(i, 1);
                score += 10;
                updateScore();
                bullets.splice(j, 1);
                break;
            }
        }
    }
}

function checkPlayerCollision() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const hit = (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        );

        if (hit) {
            enemies.splice(i, 1);
            if (vidas > 0) vidas--;
            updateVidas();

            if (vidas <= 0 && !gameOver) {
                gameOver = true;
                break; 
            }
        }
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
    revisarDificultad();
    updateHighScore();
}

function updateVidas() {
    if (vidas < 0) vidas = 0;
    document.getElementById('vidas').textContent = vidas;
}

function mostrarGameOver() {
    sonidoGameOver.play();
    ctx.fillStyle = 'red';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}

document.getElementById('btn-jugar').addEventListener('click', () => {
    document.getElementById('menu-inicio').style.display = 'none';
    iniciarJuego();
});

function shootEnemy(enemy) {
    enemyBullets.push({
        x: enemy.x + enemy.width / 2 - 2,
        y: enemy.y + enemy.height,
        width: 4,
        height: 10,
        speed: enemyBulletSpeed, // ✅ velocidad dinámica
        color: 'orange'
    });
}

function drawEnemyBullets() {
    enemyBullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function updateEnemyBullets() {
    enemyBullets.forEach(bullet => bullet.y += bullet.speed);

    // Eliminar las que salen
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        if (enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
        }
    }
}

function checkPlayerBulletCollision() {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        const hit = (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        );

        if (hit) {
            enemyBullets.splice(i, 1);
            if (vidas > 0) vidas--;
            updateVidas();

            if (vidas <= 0 && !gameOver) {
                gameOver = true;
                break;
            }
        }
    }
}

function revisarDificultad() {
    if (score % 100 === 0 && score !== 0) {
        nivel++;
        velocidadEnemigo += 0.5;
        if (spawnRate > 30) spawnRate -= 5;

        // 📈 Aumentar velocidad de balas enemigas también
        enemyBulletSpeed += 0.5;

        // ✅ Puedes mejorar también el disparo del jugador (opcional)
        if (nivel % 3 === 0) {
            playerBulletSpeed += 1;
        }
    }
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    document.getElementById('highscore').textContent = highScore;
}