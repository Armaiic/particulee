// Import the CSS file for styling
import "./style.css";

// Get a reference to the canvas element and set its dimensions
const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;
const ctx = canvas.getContext("2d")!;
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
canvas.style.background = "#000000";

// Define constants for circle properties
const initialCircleRadius = 50; // Initial radius of the circles (can be adjusted)
const savedistance = initialCircleRadius * 4; // Minimum distance between dots

// Function to calculate distance between two points
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// Variable to store the clicked dot
let clickedDot: { x: number; y: number; radius: number; color: string; mass: number } | null = null;

canvas.addEventListener("click", handleClick);

function handleClick(event: MouseEvent) {
  var x = event.clientX - canvas.getBoundingClientRect().left;
  var y = event.clientY - canvas.getBoundingClientRect().top;

  for (const dot of dots) {
    // Check if the click is within the dot
    var distance = calculateDistance(x, y, dot.x, dot.y);
    if (distance <= dot.radius) {
      clickedDot = dot;
      clickedDot.radius = Math.random() * 50 + 20; // Change the radius of the clicked dot
      clickedDot.color = getRandomHexColor();
      break;
    }
  }
}

// Function to create a new dot on the canvas
function createDot() {
  // Generate random coordinates for the dot within the canvas size
  const randomCoordinates = getRandomCoordinates();
  const { x, y } = randomCoordinates;

  // Generate random mass for the dot
  const mass = getRandomMass();

  // Generate random velocity for the dot based on mass
  const { vx, vy } = getRandomVelocity(mass);

  // Get a random color for the dot
  const color = getRandomHexColor();

  let isok = true;

  // Check if the dot is too close to other dots
  for (const dot of dots) {
    // Calculate the distance between the new dot and existing dots
    const distance = calculateDistance(x, y, dot.x, dot.y);

    // Check if the new dot is too close to others
    if (distance < savedistance) {
      isok = false;
      break;
    }
  }

  // If the dot is not too close to others, add it to the array
  if (isok) {
    dots.push({ x, y, vx, vy, radius: initialCircleRadius, color, mass });
  }
}

// Array to store the dots and their positions
const dots: { x: number; y: number; vx: number; vy: number; radius: number; color: string; mass: number }[] = [];

// Function to generate random x and y coordinates within the canvas size
function getRandomCoordinates() {
  const safeborder = initialCircleRadius * 2;
  const x = Math.random() * (width - safeborder * 2) + safeborder;
  const y = Math.random() * (height - safeborder * 2) + safeborder;
  return { x, y };
}

// Function to generate a random mass for the dots
function getRandomMass() {
  // Define the range of random mass values
  const minMass = 0.5;
  const maxMass = 5;

  // Generate a random mass value within the range
  return Math.random() * (maxMass - minMass) + minMass;
}

// Function to generate random velocity for the dots based on mass
function getRandomVelocity(mass: number) {
  // Define the range of random speeds for the dots based on mass
  const minSpeed = 2;
  const maxSpeed = 10;

  // Generate random velocities with random directions (positive or negative)
  const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
  const angle = Math.random() * 2 * Math.PI; // Random angle in radians

  // Calculate vx and vy based on speed and angle
  const vx = (speed / mass) * Math.cos(angle);
  const vy = (speed / mass) * Math.sin(angle);

  return { vx, vy };
}

// Function to generate a random hex color
function getRandomHexColor(): string {
  let randomcolor = "#";
  const letters = "0123456789ABCDEF";

  for (let i = 0; i < 6; i++) {
    randomcolor += letters[Math.floor(Math.random() * 16)];
  }

  return randomcolor;
}

// Function to handle elastic collisions between dots
function handleElasticCollisions() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dot1 = dots[i];
      const dot2 = dots[j];

      // Calculate the vector between the centers of the two dots
      const dx = dot2.x - dot1.x;
      const dy = dot2.y - dot1.y;

      // Calculate the distance between the centers of the two dots
      const distance = calculateDistance(dot1.x, dot1.y, dot2.x, dot2.y);

      if (distance < dot1.radius + dot2.radius) {
        // Calculate the unit normal and unit tangent vectors
        const nx = dx / distance; // Normal vector in x-direction
        const ny = dy / distance; // Normal vector in y-direction
        const tx = -ny; // Tangent vector in x-direction
        const ty = nx; // Tangent vector in y-direction

        // Calculate dot products of velocities with normal and tangent vectors
        const dot1Normal = dot1.vx * nx + dot1.vy * ny; // Velocity of dot1 along the normal direction
        const dot1Tangent = dot1.vx * tx + dot1.vy * ty; // Velocity of dot1 along the tangent direction
        const dot2Normal = dot2.vx * nx + dot2.vy * ny; // Velocity of dot2 along the normal direction
        const dot2Tangent = dot2.vx * tx + dot2.vy * ty; // Velocity of dot2 along the tangent direction

        // Calculate new normal velocities after collision (elastic collision formula)
        const dot1NewNormal = ((dot1Normal * (dot1.mass - dot2.mass)) + (2 * dot2.mass * dot2Normal)) / (dot1.mass + dot2.mass);
        const dot2NewNormal = ((dot2Normal * (dot2.mass - dot1.mass)) + (2 * dot1.mass * dot1Normal)) / (dot1.mass + dot2.mass);

        // Update dot velocities after collision
        dot1.vx = dot1NewNormal * nx + dot1Tangent * tx;
        dot1.vy = dot1NewNormal * ny + dot1Tangent * ty;
        dot2.vx = dot2NewNormal * nx + dot2Tangent * tx;
        dot2.vy = dot2NewNormal * ny + dot2Tangent * ty;

        // Adjust colors after collision (optional)
        dot1.color = getRandomHexColor();
        dot2.color = getRandomHexColor();
      }
    }
  }
}

// Function to move the dots on the canvas
function moveDots() {
  ctx.clearRect(0, 0, width, height);

  dots.forEach((dot, index) => {
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (dot.x - dot.radius < 0 || dot.x + dot.radius > width) {
      dot.vx *= -1;
      dot.color = getRandomHexColor();
      dot.x = Math.max(dot.radius, Math.min(width - dot.radius, dot.x));
    }
    if (dot.y - dot.radius < 0 || dot.y + dot.radius > height) {
      dot.vy *= -1;
      dot.color = getRandomHexColor();
      dot.y = Math.max(dot.radius, Math.min(height - dot.radius, dot.y));
    }

    if (dot.x < 0 || dot.x > width || dot.y < 0 || dot.y > height) {
      dots.splice(index, 1);
    }
  });

  handleElasticCollisions();

  if (dots.length < 100) {
    createDot();
  }

  dots.forEach((dot) => {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });

  // Reset clickedDot after drawing
  clickedDot = null;
}

// Start moving dots with a set interval for animation (60 frames per second)
setInterval(moveDots, 1000 / 60);

// Initial dot creation
for (let i = 0; i < 100; i++) {
  createDot(); // Create 50 initial dots
}

// Initial draw of the dots
moveDots();
