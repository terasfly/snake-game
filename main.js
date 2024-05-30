const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Sukuriame gyvatės segmentų masyvą

let squareSize = 30;

const snake = [
    { x: 210, y: 210 },
    { x: 180, y: 210 },
    { x: 150, y: 210 },
    { x: 120, y: 210 },
    { x: 90, y: 210 }
];

let food = startingFood();

function getRandomCoordinate(max) {
    return Math.floor(Math.random() * (max / squareSize)) * squareSize;
}

function startingFood() {
    return {
        x: getRandomCoordinate(canvas.width),
        y: getRandomCoordinate(canvas.height)
    };
}

function genFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        food.x = Math.floor(Math.random() * (canvas.width / squareSize)) * squareSize;
        food.y = Math.floor(Math.random() * (canvas.height / squareSize)) * squareSize;
        let lastSegment = snake[snake.length - 1];
        let newSegment = { x: lastSegment.x, y: lastSegment.y };
        snake.push(newSegment);
        console.log(`Naujos maisto koordinatės: (${food.x}, ${food.y})`);
    }
}

function drawFood() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(food.x, food.y, 30, 30);
}

function snakePart(drawSnake) {
    ctx.fillStyle = 'brown';
    ctx.fillRect(drawSnake.x, drawSnake.y, 30, 30);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(drawSnake.x, drawSnake.y, 30, 30);
}

function loopSnakeParts(snakeTail) {
    for (let i = 0; i < snakeTail.length; i++) {
        snakePart(snakeTail[i]);
    }
}

let dx = 0;
let dy = 0;

function snakeMovement() {
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (dx !== 0 || dy !== 0) {
        snake.pop();
    }
}

document.addEventListener('keydown', (event) => {
    const button = event.key;
    if (button === 'ArrowUp' && dy === 0) {
        dy = -30;
        dx = 0;
    } else if (button === 'ArrowDown' && dy === 0) {
        dy = 30;
        dx = 0;
    } else if (button === 'ArrowLeft' && dx === 0) {
        dx = -30;
        dy = 0;
    } else if (button === 'ArrowRight' && dx === 0) {
        dx = 30;
        dy = 0;
    }
    console.log(button);
});

// Pridėkite prisilietimo valdymą
document.addEventListener('touchstart', handleTouch);

function handleTouch(event) {
    let touch = event.touches[0];
    let touchX = touch.clientX;
    let touchY = touch.clientY;

    // Nustatykite kryptį pagal prisilietimo vietą ekrane
    if (touchY < canvas.height / 2 && dy === 0) { // Jei prisilietimas virš drobės vidurio
        dy = -30;
        dx = 0;
    } else if (touchY > canvas.height / 2 && dy === 0) { // Jei prisilietimas žemiau drobės vidurio
        dy = 30;
        dx = 0;
    } else if (touchX < canvas.width / 2 && dx === 0) { // Jei prisilietimas kairiau drobės vidurio
        dx = -30;
        dy = 0;
    } else if (touchX > canvas.width / 2 && dx === 0) { // Jei prisilietimas dešiniau drobės vidurio
        dx = 30;
        dy = 0;
    }
    console.log(`touchX: ${touchX}, touchY: ${touchY}`);
}

function initialDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    loopSnakeParts(snake);
}

function runGame() {
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        snakeMovement();
        genFood();
        loopSnakeParts(snake);
    }, 100);
}

initialDraw();
