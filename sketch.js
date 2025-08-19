let game = {
  pixal: 40,
  window: 800,
  red: 0,
  green: 255,
  blue: 0,
  score: 0,
  fps: 5,
  death: false
}

let snake = {
  x: game.pixal,
  y: game.pixal,
  direction: null,
  movement: game.pixal,
  tail: []
};

let food = {
  x: 18 * game.pixal,
  y: 18 * game.pixal
}

function reset() {
  game.fps = 5;
  game.red = 0;
  game.green = 255;
  game.blue = 0;
  game.score = 0;
  snake.direction = null;
  snake.movement = game.pixal;

  snake.x = 40;
  snake.y = 40;
  snake.tail = [];

  food.x = 18 * game.pixal;
  food.y = 18 * game.pixal;
}

function setup() {
  createCanvas(game.window, game.window);
}

function draw() {
  frameRate(game.fps + game.score / 4);
  strokeWeight(4);
  background(220);
  drawGrid();

  controls();
  moveSnake();

  // Draw Snake
  fill(game.red, game.green, game.blue);
  rect(snake.x, snake.y, game.pixal);
  tail();

  // Head Indicator
  fill(0);
  rect(snake.x + 18, snake.y + 18, 4)

  // Draw food
  eat();
  fill(0, 0, 204)
  rect(food.x, food.y, game.pixal);

  enforceRules();
}

function drawGrid() {
  for (let x = 0; x < game.window; x += game.pixal) {
    for (let y = 0; y < game.window; y += game.pixal) {
      stroke(0);
      noFill();
      rect(x, y, game.pixal, game.pixal);
    }
  }
}

function moveSnake() {
  // Move snake head
  if (snake.direction === "right") {
    snake.x += snake.movement;
  } else if (snake.direction === "left") {
    snake.x -= snake.movement;
  } else if (snake.direction === "up") {
    snake.y -= snake.movement;
  } else if (snake.direction === "down") {
    snake.y += snake.movement;
  }

  // gameover if off-screen
  if (snake.x < 0 || snake.y < 0 || snake.x > 19 * game.pixal || snake.y > 19 * game.pixal) {
    game.death = true;
  }
}

function tail() {
  let tail2 = [];

  // Draw tail
  for (let i = 0; i < snake.tail.length; i++) {
    let tailSegment = snake.tail[i];
    rect(tailSegment.x, tailSegment.y, game.pixal, game.pixal);
  }

  // Add segment to tail
  snake.tail.unshift({ x: snake.x, y: snake.y });
  tail2 = snake.tail.slice(1);

  // JS is tricky with objects, instead see JSON output then see if one contains the other
  // Self-collision check
  if (JSON.stringify(tail2).includes(JSON.stringify(snake.tail[0]))) {
    //turn red for now to indicate self-collision
    //change to "death" and restart
    game.red = 255;
    game.green = 0;
    game.death = true;
  }
  // Remove last segment from tail if too long
  if (snake.tail.length > game.score) {
    snake.tail.pop();
  }
}

function controls() {
  switch (key) {
    case 'w':
      if (snake.direction !== "down") {
        snake.direction = "up"
      }
      break;
    case 's':
      if (snake.direction !== "up") {
        snake.direction = "down"
      }
      break;
    case 'a':
      if (snake.direction !== "right") {
        snake.direction = "left"
      }
      break;
    case 'd':
      if (snake.direction !== "left") {
        snake.direction = "right"
      }
      break;
  }
}

function randomPos() {
  rdm = (Math.floor(Math.random() * 20)) * game.pixal;
  return rdm;
}

function eat() {
  if (food.x === snake.x && food.y === snake.y) {
    game.score += 1;
    food.x = randomPos();
    food.y = randomPos();
  }
}

// GameOver Screen, Display Score and Restart
function enforceRules() {
  if (game.death == true) {
    snake.movement = 0;
    fill(255, 165, 0);
    textSize(50);
    text("Yikes, Game over!", 5 * game.pixal + 5, 8 * game.pixal - 4);
    text("Press B to restart.", 5 * game.pixal + 5, 10 * game.pixal - 4);
    fill(0, 206, 209);
    text("Score: " + game.score, 7 * game.pixal + 5, 12 * game.pixal - 4);
  }
  if (key == 'b') {
    game.death = false;
    reset();
  }
}

