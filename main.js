// Gaukite canvas elementą iš HTML dokumento
const canvas = document.getElementById('canvas');
// Gaukite 2D piešimo kontekstą canvas elementui
const ctx = canvas.getContext('2d');
// Gaukite game over elementą iš HTML dokumento
const gameOver = document.querySelector('.gameOver');
// Gaukite score elementą iš HTML dokumento
const score = document.querySelector('.score__digit');
// Gaukite highest score elementą iš HTML dokumento
const highestScore = document.querySelector('.highestScore__digit');

// Inicializuokite dabartinį taškų skaičių iki 0
let scoreCounting = 0;
// Inicializuokite didžiausią taškų skaičių iki 0
let highestScoreSet = 0;

// Funkcija, kuri atnaujina didžiausią taškų skaičių, jei dabartinis taškų skaičius yra didesnis
function highestScorecount() {
    if (scoreCounting > highestScoreSet) {
        highestScoreSet = scoreCounting;
        highestScore.textContent = highestScoreSet;
    }
}

// Gyvatės segmento dydis
let squareSize = 30;
// Kintamasis, kuris laikys žaidimo intervalą
let gameInterval;

// Masyvas, kuris laikys pradinius gyvatės segmentus
const snake = [
    { x: 210, y: 210 },
    { x: 180, y: 210 },
    { x: 150, y: 210 },
    { x: 120, y: 210 },
    { x: 90, y: 210 }
];

// Pradinio maisto nustatymas
let food = startingFood();

// Funkcija, kuri generuoja atsitiktinį maistą
function generateRandomFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / squareSize)) * squareSize,
        y: Math.floor(Math.random() * (canvas.height / squareSize)) * squareSize
    };
}

// Funkcija, kuri tikrina, ar maistas yra ant gyvatės
function foodOnSnake(food, snake) {
    for (let i = 0; i < snake.length; i++) {
        let segment = snake[i];
        if (food.x === segment.x && food.y === segment.y) {
            return true;
        }
    }
    return false;
}

// Funkcija, kuri nustato pradinį maistą, kad jis nebūtų ant gyvatės
function startingFood() {
    let newFood;
    for (let i = 0; i < 100; i++) {
        newFood = generateRandomFood();
        if (!foodOnSnake(newFood, snake)) {
            return newFood;
        }
    }
    return newFood;
}

// Funkcija, kuri generuoja maistą ir atnaujina taškų skaičių
function genFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        scoreCounting += 1;
        score.textContent = scoreCounting;
        food = startingFood();
        let lastSegment = snake[snake.length - 1];
        let newSegment = { x: lastSegment.x, y: lastSegment.y };
        snake.push(newSegment);
    }
}

// Funkcija, kuri piešia maistą
function drawFood() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(food.x, food.y, 30, 30);
}

// Funkcija, kuri tikrina, ar gyvatė atsitrenkė į savo uodegą
function snakeTail(snake) {
    const snakeHead = snake[0];
    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        if (snakeHead.x === segment.x && snakeHead.y === segment.y) {
            alert('atsitrenke');
            clearInterval(gameInterval);
            reset();
        }
    }
}

// Funkcija, kuri piešia gyvatės segmentą
function snakePart(drawSnake) {
    ctx.fillStyle = 'brown';
    ctx.fillRect(drawSnake.x, drawSnake.y, 30, 30);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(drawSnake.x, drawSnake.y, 30, 30);
}

// Funkcija, kuri piešia visus gyvatės segmentus
function loopSnakeParts(snakeTail) {
    for (let i = 0; i < snakeTail.length; i++) {
        snakePart(snakeTail[i]);
    }
}

// Kintamieji gyvatės judėjimui
let dx = 0;
let dy = 0;

// Funkcija, kuri atnaujina gyvatės padėtį
function snakeMovement() {
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (dx !== 0 || dy !== 0) {
        snake.pop();
    }
}

// Funkcija, kuri tikrina, ar gyvatė atsitrenkė į sieną
function snakeHitWall() {
    if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= canvas.width || snake[0].y >= canvas.height) {
        clearInterval(gameInterval);
        reset();
        dx = 0;
        dy = 0;
        gameOver.style.display = 'block';
    }
}

// Funkcija, kuri atstato žaidimą
function reset() {
    highestScorecount();
    scoreCounting = 0;
    snake.length = 0;
    snake.push({ x: 210, y: 210 }, { x: 180, y: 210 }, { x: 150, y: 210 }, { x: 120, y: 210 }, { x: 90, y: 210 });
    food = startingFood();
    initialDraw();
    gameStarted = false;
}

// Kintamasis, kuris nurodo, ar žaidimas pradėtas
let gameStarted = false;

// Įvykio klausytojas klaviatūros paspaudimams
document.addEventListener('keydown', (event) => {
    if (!gameStarted) {
        gameStarted = true;
        runGame();
    }
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
});

// Funkcija, kuri nupiešia pradinį žaidimo ekraną
function initialDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    loopSnakeParts(snake);
}

// Funkcija, kuri paleidžia žaidimą
function runGame() {
    gameInterval = setInterval(() => {
        score.textContent = scoreCounting;
        gameOver.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        snakeMovement();
        genFood();
        snakeHitWall();
        snakeTail(snake);
        loopSnakeParts(snake);
    }, 100);
}

// Pradinis žaidimo piešimas
initialDraw();
