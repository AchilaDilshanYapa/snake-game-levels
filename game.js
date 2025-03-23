const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');

canvas.width = 400;
canvas.height = 400;
const gridSize = 20;

let snake = [
    { x: 200, y: 200 }
];
let food = generateFood();
let direction = 'right';
let score = 0;
let gameLoop;

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

function drawSnake() {
    ctx.fillStyle = '#00ff00';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
}

// Add these new variables at the top
const levelValue = document.getElementById('levelValue');
const levelUpMessage = document.getElementById('levelUpMessage');
const currentLevelSpan = document.getElementById('currentLevel');
const nextLevelSpan = document.getElementById('nextLevel');

let currentLevel = 1;
let gameSpeed = 100;

const levelThresholds = {
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    6: 600,
    7: 700,
    8: 800,
    9: 900,
    10: 1000
};

// Add these speed configurations at the top with other variables
const levelSpeeds = {
    1: 100,    // Normal speed
    2: 80,     // Faster
    3: 65,     // Even faster
    4: 55,
    5: 45,
    6: 35,
    7: 30,
    8: 25,
    9: 20,
    10: 15     // Very fast
};

// Update the checkLevelUp function
function checkLevelUp() {
    if (currentLevel < 10 && score >= levelThresholds[currentLevel]) {
        showLevelUpMessage();
        currentLevel++;
        levelValue.textContent = currentLevel;
        // Update game speed based on level
        gameSpeed = levelSpeeds[currentLevel];
        clearInterval(gameLoop);
        gameLoop = setInterval(update, gameSpeed);
    }
}

// Update the restartGame function
function restartGame() {
    snake = [{ x: 200, y: 200 }];
    direction = 'right';
    score = 0;
    currentLevel = 1;
    gameSpeed = levelSpeeds[1];  // Reset to initial speed
    scoreElement.textContent = score;
    levelValue.textContent = currentLevel;
    food = generateFood();
    gameOverMessage.style.display = 'none';
    levelUpMessage.style.display = 'none';
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

function showLevelUpMessage() {
    clearInterval(gameLoop);
    currentLevelSpan.textContent = currentLevel;
    nextLevelSpan.textContent = currentLevel + 1;
    levelUpMessage.style.display = 'block';
    
    setTimeout(() => {
        levelUpMessage.style.display = 'none';
        gameLoop = setInterval(update, gameSpeed);
    }, 2000);
}

// Modify the moveSnake function to include level check
function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'right': head.x += gridSize; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        checkLevelUp();
        food = generateFood();
    } else {
        snake.pop();
    }
}

// Modify the restartGame function
function restartGame() {
    snake = [{ x: 200, y: 200 }];
    direction = 'right';
    score = 0;
    currentLevel = 1;
    gameSpeed = 100;
    scoreElement.textContent = score;
    levelValue.textContent = currentLevel;
    food = generateFood();
    gameOverMessage.style.display = 'none';
    levelUpMessage.style.display = 'none';
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

function checkCollision() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Add these at the top with your other constants
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const exitBtn = document.getElementById('exitBtn');

// Add this variable at the top
const finalLevel = document.getElementById('finalLevel');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const exitGameBtn = document.getElementById('exitGameBtn');

// Update the gameOver function
function gameOver() {
    clearInterval(gameLoop);
    gameOverMessage.style.display = 'block';
    finalScore.textContent = score;
    finalLevel.textContent = currentLevel;
}

// Add these event listeners
tryAgainBtn.addEventListener('click', restartGame);
exitGameBtn.addEventListener('click', () => {
    window.close();
    // Fallback if window.close() is blocked
    document.body.innerHTML = '<h1 style="text-align: center; margin-top: 50px;">Game Closed. You can close this tab.</h1>';
});

// Add these new functions
function restartGame() {
    snake = [{ x: 200, y: 200 }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    food = generateFood();
    gameOverMessage.style.display = 'none';
    clearInterval(gameLoop);
    gameLoop = setInterval(update, 100);
}

// Add these event listeners at the bottom of your file
restartBtn.addEventListener('click', restartGame);
exitBtn.addEventListener('click', () => {
    window.close();
    // Fallback if window.close() is blocked
    document.body.innerHTML = '<h1 style="text-align: center; margin-top: 50px;">Game Closed. You can close this tab.</h1>';
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    drawFood();
    drawSnake();
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

gameLoop = setInterval(update, 100);