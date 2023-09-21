import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;
const ctx = canvas.getContext("2d")!;
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const circleRadius = 50; // Adjust the size of the circle here

// Create an array to store the dots and their positions
const dots: { x: number; y: number; vx: number; vy: number;couleur: string  }[] = [];

// Randomly generate x and y values within the specified range
function getRandomCoordinates() {
  const x = Math.random() * width;
  const y = Math.random() * height;
  return { x, y };
}

function getRandomVelocity() {
  const minSpeed = 1;
  const maxSpeed = 4;
  const vx =
    (Math.random() * (maxSpeed - minSpeed) + minSpeed) *
    (Math.random() < 0.5 ? -1 : 1);
  const vy =
    (Math.random() * (maxSpeed - minSpeed) + minSpeed) *
    (Math.random() < 0.5 ? -1 : 1);
  return { vx, vy };
}

// Function to generate a random hex color
function getRandomHexColor(): string {
  var randomcolor = "#";
  var letters = "0123456789ABCDEF";
  for (var i = 0; i < 6; i++) {
    randomcolor += letters[Math.floor(Math.random() * 16)];
  }
  return randomcolor;
}

// Updated makedot function to create and store dots
function makedot() {
  const randomCoordinates = getRandomCoordinates();
  const { x, y } = randomCoordinates;
  const { vx, vy } = getRandomVelocity();
  const couleur = getRandomHexColor(); // Get a random color here
  dots.push({ x, y, vx, vy, couleur });
}

// Function to move the dots 
function moveDots() {
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  dots.forEach((dot, index) => {
    // Randomly change the dot's position within a small range
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (dot.x < 0 || dot.x > width) {
      dot.vx *= -1;
    }
    if (dot.y < 0 || dot.y > height) {
      dot.vy *= -1;
    }

    // Remove dots that are too far from the canvas to save memory
    if (dot.x < 0 || dot.x > width || dot.y < 0 || dot.y > height) {
      dots.splice(index, 1);
    }
  });

  // Add new dots if the number of dots is below a certain threshold
  if (dots.length < 100) {
    makedot();
  }

  // Draw each dot
  dots.forEach((dot) => {
    ctx.fillStyle = dot.couleur; // Set the color from dot object
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, circleRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
}

// Start moving dots with setInterval
setInterval(moveDots, 1000 / 60); // 60 FPS

// Initial dot creation
for (let i = 0; i < 100; i++) {
  makedot();
}

// Initial draw
moveDots();