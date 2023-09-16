// JavaScript код для гри

// Отримуємо доступ до елементів гри
const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.game-start');
const resetButton = document.querySelector('.game-reset');

// Зображення змійки та їжі
const snakeImg = new Image();
snakeImg.src = 'img/snake.png';

const foodImg = new Image();
foodImg.src = 'img/cherry.png';

// Розміри кожного сегмента змійки та їжі
const segmentSize = 20;

// Початкові значення
let snake;
let food;
let direction;
let isGameRunning;
let score;

// Функція для початку нової гри
function startGame() {
    // Ініціалізуємо змінні для нової гри
    snake = [{ x: 100, y: 100 }];
    food = generateFood();
    direction = { x: 1, y: 0 };
    isGameRunning = true;
    score = 0;
    scoreDisplay.textContent = 'Очки: ' + score;

    // Встановлюємо інтервал для руху змійки
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, 200);

    // Видаляємо повідомлення про програш, якщо воно було
    const gameOverMessage = document.querySelector('.game-over');
    if (gameOverMessage) {
        gameOverMessage.remove();
    }
}

// Генеруємо нову їжу на полі гри
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / segmentSize)) * segmentSize,
        y: Math.floor(Math.random() * (canvas.height / segmentSize)) * segmentSize
    };
}

// Оновлюємо положення змійки
function moveSnake() {
    // Переміщаємо змійку на нові координати відповідно до напрямку руху
    const newHead = {
        x: snake[0].x + direction.x * segmentSize,
        y: snake[0].y + direction.y * segmentSize
    };

    // Перевіряємо, чи зіткнулась змійка з межами поля гри або самою собою
    if (newHead.x < 0 || newHead.y < 0 || newHead.x >= canvas.width || newHead.y >= canvas.height || isCollision(newHead)) {
        gameOver();
        return;
    }

    // Додаємо нову голову змійки
    snake.unshift(newHead);

    // Перевіряємо, чи змійка з'їла їжу
    if (newHead.x === food.x && newHead.y === food.y) {
        // Збільшуємо кількість очків
        score++;
        scoreDisplay.textContent = 'Очки: ' + score;

        // Генеруємо нову їжу
        food = generateFood();
    } else {
        // Видаляємо хвіст змійки, якщо їжу не з'їли
        snake.pop();
    }

    // Оновлюємо поле гри
    drawGame();
}

// Перевіряємо, чи змійка зіткнулась з самою собою
function isCollision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Зупиняємо гру та виводимо повідомлення про програш
function gameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;

    ctx.font = '24px Montserrat, sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Гра закінчена! Ваш результат: ' + score, canvas.width / 2, canvas.height / 2);

    // Додаємо повідомлення про програш для перезапуску гри
    /*const gameOverMessage = document.createElement('div');
    gameOverMessage.classList.add('game-over');
    gameOverMessage.textContent = 'Гра закінчена! Ваш результат: ' + score;
    document.body.appendChild(gameOverMessage);*/
}

// Функція для малювання поля гри та об'єктів
function drawGame() {
    // Очищаємо поле гри
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Малюємо їжу
    ctx.drawImage(foodImg, food.x, food.y, segmentSize, segmentSize);

    // Малюємо змійку
    for (let i = 0; i < snake.length; i++) {
        ctx.drawImage(snakeImg, snake[i].x, snake[i].y, segmentSize, segmentSize);
    }
}

// Обробник натиснення кнопки "Старт"
startButton.addEventListener('click', () => {
    if (!isGameRunning) {
        startGame();
    }
});

// Обробник натиснення кнопки "Перезапуск"
resetButton.addEventListener('click', () => {
    startGame();
});

// Обробник клавіш клавіатури
document.addEventListener('keydown', (event) => {
    if (isGameRunning) {
        // Змінюємо напрямок руху змійки відповідно до клавіш
        switch (event.key) {
            case 'ArrowUp':
                if (direction.y !== 1) {
                    direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (direction.y !== -1) {
                    direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (direction.x !== 1) {
                    direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (direction.x !== -1) {
                    direction = { x: 1, y: 0 };
                }
                break;
        }
    }
});

// Початковий запуск гри
let gameInterval;
drawGame();

