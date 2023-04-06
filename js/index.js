
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const obstacles = [];
let gameStarted = false;
let points = 0;

function resetCanvas(callback) {
  ctx.clearRect(0, 0, 500, 700); // 700 and 450 are canvas width and height
  // reload background
  const background = new Image();
  background.src = "./images/road.png";
  ctx.drawImage(background, 0, 0, 500, 700);
  if (callback) {
    callback();
  }
}


class Car {
  constructor() {
    this.x = 125;
    this.y = 650;

    // Load the image
    const img = new Image();
    img.src = './images/car.png';
    this.img = img;

  }

  moveRight() {
    this.x += 25;
    if (this.x > 450) {
      this.x = 425;
    }
  }

  moveLeft() {
    this.x -= 25;
    if (this.x < 0) {
      this.x = 30;
    }
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, 50, 50);
  }

}

class Obstacle {

  constructor(width, height, x, y, speed) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    // new speed properties
    this.speedY = speed;
  }

  newPos() {
    this.y += this.speedY;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "red";
    ctx.fill();
  }

}

function createObstacle() {
  let randomWidth = Math.random() * 350;
  if (randomWidth <= 200) {
    randomWidth = 200;
  };
  let height = 40;
  let randomSpeed = Math.random() * 7;
  if (randomSpeed < 4) {
    randomSpeed = 4;
  }
  let randomX = Math.random() * 400;
  const randomObstacle = new Obstacle(randomWidth, height, randomX, 0, randomSpeed);
  obstacles.push(randomObstacle);
}

function updateObstacles(car) {

  // check all obstacles in obstacles[] and update position

  obstacles.forEach((element, index) => {
    element.newPos();
    element.draw();
    let obstacleBorderX = [element.x, (element.x+element.width)];
    let obstacleBorderY = [element.y, (element.y+element.height)];
    
    if(car.x > obstacleBorderX[0] && car.x < obstacleBorderX[1]){
      if(car.y > obstacleBorderY[0] && car.y < obstacleBorderY[1]){
        endGame();
      }
    }

    if (element.y > 700) {
      obstacles.splice(index, 1);
      points++;
      if (points > 19) {
        victory();
      }
    }
   
  })

}

// interval to create and add obstacles to obstacles[]
function endGame() {


  clearInterval(updateInterval);
  clearInterval(createObstacleInterval);
  
  document.getElementById('game-board').innerHTML = `<p id="game-over">GAME OVER</p><p>Point Total: ${points}</p>`
}

function victory() {
  clearInterval(updateInterval);
  clearInterval(createObstacleInterval);
  document.getElementById('game-board').innerHTML = `<p id="win-condition">VICTORY!</p><p>Point Total: ${points}</p>`
}

function startGame() {

  if (gameStarted === false) {
  gameStarted = true;
  const car = new Car();

  // register car controls handlers
  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 37:
        car.moveLeft()
        break;
      case 38:
        break;
      case 39:
        car.moveRight();
        break;
      case 40:
        break;
    }

  };

  window.createObstacleInterval = setInterval(createObstacle, 1500);

  // update canvas
  window.updateInterval = setInterval(() => {
    resetCanvas();
    car.draw();
    updateObstacles(car);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Points: ${points}`, 10, 50);
  }, 16);
}

}


window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };
};