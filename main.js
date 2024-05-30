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

let food = startingFood()

function getRandomCoordinate(max) {
    return Math.floor(Math.random() * (max / squareSize)) * squareSize
}

function startingFood() {
    return {
        x: getRandomCoordinate(canvas.width),
        y: getRandomCoordinate(canvas.height)
    }
}


function genFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {

        // alert('pavyko');
        // Generuoja naujas maisto koordinatės
        food.x = Math.floor(Math.random() * (canvas.width / squareSize)) * squareSize
        food.y = Math.floor(Math.random() * (canvas.height / squareSize)) * squareSize
        let lastSegment = snake[snake.length - 1];
        // console.log(lastSegment)
        let newSegment = { x: lastSegment.x, y: lastSegment.y }
            // console.log(newSegment)
        snake.push(newSegment)

        console.log(`Naujos maisto koordinatės: (${food.x}, ${food.y})`);
    }
    //     Math.random() grąžina 0.5
    // canvas.width / squareSize yra 17
    // Math.random() * (canvas.width / squareSize) yra 0.5 * 17 = 8.5
    // Math.floor(8.5) yra 8
    // 8 * squareSize yra 8 * 30 = 240
    // Taigi, food.x bus 240, o tai yra teisinga kvadrato vieta drobėje.
    ////////////////////////////////////////////////////////////////////
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
    // console.log(snake);
}

// function checkCollision() {


//     if (snake[0].x === food.x && snake[0].y === food.y) {
//         alert('Maistas suvalgytas!');
//         food = generateFood(); // Sugeneruojame naują maistą
//         snake.push({...snake[snake.length - 1] }); // Pridedame naują segmentą gyvatei
//     }
// }

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
    console.log(button);
});

function initialDraw() {
    // Išvalome drobę ir nupiešiame pradinę būseną (gyvatę ir maistą)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    loopSnakeParts(snake);
}

function runGame() {
    // Paleidžiame intervalą, kuris atnaujina žaidimo būseną kas 100 milisekundžių
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        snakeMovement();
        genFood() // Patikriname, ar gyvatė suvalgė maistą
        loopSnakeParts(snake);
    }, 100);
}

// Pradinis piešinys, kad būtų rodoma pradinė gyvatės būklė prieš pradedant žaidimą
initialDraw();
