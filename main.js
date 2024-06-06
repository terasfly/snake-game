const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gameOver = document.querySelector('.gameOver');
const score = document.querySelector('.score__digit');
const highestScore = document.querySelector('.highestScore__digit');

// Counting best result
let scoreCounting = 0;
let highestScoreSet = 0;

function highestScorecount() {
    if (scoreCounting > highestScoreSet) {
        highestScoreSet = scoreCounting;
        highestScore.textContent = highestScoreSet;
    }
}

// Sukuriame gyvatės segmentų masyvą
let squareSize = 30;
let gameInterval;

const snake = [
    { x: 210, y: 210 },
    { x: 180, y: 210 },
    { x: 150, y: 210 },
    { x: 120, y: 210 },
    { x: 90, y: 210 }
];

let food = startingFood();

function generateRandomFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / squareSize)) * squareSize,
        y: Math.floor(Math.random() * (canvas.height / squareSize)) * squareSize
    };
}

function isFoodOnSnake(food) {
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        if (segment.x === food.x && segment.y === food.y) {
            return true; // Maisto koordinatės sutampa su gyvatės segmentu
        }
    }
    return false; // Maisto koordinatės nesutampa su gyvatės segmentais
}

function startingFood() {
    let newFood;
    for (let i = 0; i < 100; i++) { // 100 bandymų riba
        newFood = generateRandomFood();
        if (!isFoodOnSnake(newFood)) {
            break; // Jei koordinatės nesutampa su gyvatės kūnu, nutraukti ciklą
        }
    }
    return newFood; // Grąžina tinkamas maisto koordinates
}

function genFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) { // Patikrina, ar gyvatės galva sutampa su maistu
        scoreCounting += 1; // Padidina rezultatą
        score.textContent = scoreCounting; // Atnaujina rezultatą ekrane

        // Generuoja naujas maisto koordinates
        for (let i = 0; i < 100; i++) { // 100 bandymų riba
            food = startingFood(); // Sugeneruoja naujas maisto koordinates
            if (!isFoodOnSnake(food)) { // Patikrina, ar maisto koordinatės nesutampa su gyvatės segmentais
                break; // Jei koordinatės nesutampa, nutraukti ciklą
            }
        }

        let lastSegment = snake[snake.length - 1]; // Paimama paskutinio segmento koordinatė
        let newSegment = { x: lastSegment.x, y: lastSegment.y }; // Sukuriamas naujas segmentas, naudojant paskutinio segmento koordinatę
        snake.push(newSegment); // Pridedamas naujas segmentas prie gyvatės
    }
}

function drawFood() {
    // Nustatome maisto spalvą ir nupiešiame jį tam tikroje vietoje
    ctx.fillStyle = 'yellow';
    ctx.fillRect(food.x, food.y, 30, 30);
}

function snakePart(drawSnake) {
    // Nustatome gyvatės segmentų spalvą ir nupiešiame juos
    ctx.fillStyle = 'brown';
    ctx.fillRect(drawSnake.x, drawSnake.y, 30, 30);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(drawSnake.x, drawSnake.y, 30, 30);
}

function loopSnakeParts(snakeTail) {
    // Iteruojame per kiekvieną gyvatės segmentą ir nupiešiame jį
    for (let i = 0; i < snakeTail.length; i++) {
        snakePart(snakeTail[i]);
    }
}

let dx = 0;
let dy = 0;

function snakeMovement() {
    // Sukuriame naują galvos segmentą, kuris juda pagal nurodytą kryptį
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (dx !== 0 || dy !== 0) { // Tik tada pašaliname uodegos segmentą, jei gyvatė juda
        snake.pop();
    }
}

function snakeHitWall() {
    if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= canvas.width || snake[0].y >= canvas.height) {
        clearInterval(gameInterval);
        reset();
        dx = 0;
        dy = 0;
        gameOver.style.display = 'block';
    }
}

function reset() {
    highestScorecount();
    scoreCounting = 0;
    snake.length = 0;
    snake.push(
        { x: 210, y: 210 },
        { x: 180, y: 210 },
        { x: 150, y: 210 },
        { x: 120, y: 210 },
        { x: 90, y: 210 }
    );
    food = startingFood();
    initialDraw();
    gameStarted = false;
}

let gameStarted = false;

document.addEventListener('keydown', (event) => {
    // Jei žaidimas dar neprasidėjo, pradėsime jį
    if (!gameStarted) {
        gameStarted = true;
        runGame();
    }
    const button = event.key;
    // Nustatome judėjimo kryptį pagal paspaustą klavišą
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

function initialDraw() {
    // Išvalome drobę ir nupiešiame pradinę būseną (gyvatę ir maistą)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    loopSnakeParts(snake);
}

function runGame() {
    // Paleidžiame intervalą, kuris atnaujina žaidimo būseną kas 100 milisekundžių
    gameInterval = setInterval(() => {
        score.textContent = scoreCounting;
        gameOver.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        snakeMovement();
        genFood(); // Patikriname, ar gyvatė suvalgė maistą
        snakeHitWall();
        loopSnakeParts(snake);
    }, 100);
}

// Pradinis piešinys, kad būtų rodoma pradinė gyvatės būklė prieš pradedant žaidimą
initialDraw();
