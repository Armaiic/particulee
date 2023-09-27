// Import the CSS file for styling
import "./style.css";

// Get a reference to the canvas element and set its dimensions
const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;
const ctx = canvas.getContext("2d")!;
let width = window.innerWidth;
let height = window.innerHeight;
const pixelRatio = window.devicePixelRatio || 1;

// Adjust canvas size and scale for high DPI displays
canvas.width = width * pixelRatio;
canvas.height = height * pixelRatio;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
ctx.scale(pixelRatio, pixelRatio);

canvas.style.background = "#000000";

// Define constants for circle properties
const initialCircleRadius = 20; // Initial radius of the circles (can be adjusted)

// Function to calculate distance between two points
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// Variable to store the clicked dot
let clickedDot: { x: number; y: number; radius: number; color: string; mass: number; attractionForce: number } | null = null;

canvas.addEventListener("click", handleClick);

// Function for calculating the mouse position and allowing to change dot size or color with a mouse click
function handleClick(event: MouseEvent) {
  let x = event.clientX - canvas.getBoundingClientRect().left;
  let y = event.clientY - canvas.getBoundingClientRect().top;
  for (const dot of dots) {
    // Check if the click is within the dot
    let distance = calculateDistance(x, y, dot.x, dot.y);
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
  const mass = getRandomMass();
  const size = initialCircleRadius + Math.random() * 30; // Random size
  const { vx, vy } = getRandomVelocity(mass);
  const color = getRandomHexColor();
  const attractionForce = Math.random() * 0.2; // Random attraction force
  const gravity = 0.2; // Gravity force

  let isok = true;

  // Check if the dot is too close to other dots
  for (const dot of dots) {
    // Calculate the distance between the new dot and existing dots
    const distance = calculateDistance(x, y, dot.x, dot.y);

    // Check if the new dot is too close to others
    if (distance < size + dot.radius) {
      isok = false;
      break;
    }
  }

  // If the dot is not too close to others, add it to the array
  if (isok) {
    dots.push({ x, y, vx, vy, radius: size, color, mass, attractionForce,gravity });
  }
}

// Array to store the dots and their positions
const dots: { x: number; y: number; vx: number; vy: number; radius: number; color: string; mass: number;gravity:number; attractionForce: number }[] = [];

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
  const minMass = 1;
  const maxMass = 5;

  // Generate a random mass value within the range
  return Math.random() * (maxMass - minMass) + minMass;
}

// Function to generate random velocity for the dots based on mass
function getRandomVelocity(mass: number) {
  // Define the range of random speeds for the dots based on mass
  const minSpeed = 1;
  const maxSpeed = 5;

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

// Function to calculate the elastic collision between multiple dots
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
        // Calculate overlap distance
        const overlap = dot1.radius + dot2.radius - distance;

        // Calculate separation vector
        const separationX = (overlap / 2) * (dx / distance);
        const separationY = (overlap / 2) * (dy / distance);

        // Move the dots apart along the separation vector
        dot1.x -= separationX;
        dot1.y -= separationY;
        dot2.x += separationX;
        dot2.y += separationY;

        // Calculate the unit normal and unit tangent vectors
        const nx = dx / distance; // Normal vector in the x-direction
        const ny = dy / distance; // Normal vector in the y-direction
        const tx = -ny; // Tangent vector in the x-direction
        const ty = nx; // Tangent vector in the y-direction

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

        dot1.radius = Math.random() * 50 + 20;
        dot2.radius = Math.random() * 50 + 20;
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
      dot.radius = Math.random() * 50 + 20;
    }
    if (dot.y - dot.radius < 0 || dot.y + dot.radius > height) {
      dot.vy *= -1;
      dot.color = getRandomHexColor();
      dot.y = Math.max(dot.radius, Math.min(height - dot.radius, dot.y));
      dot.radius = Math.random() * 50 + 20;
    }

    if (dot.x < 0 || dot.x > width || dot.y < 0 || dot.y > height) {
      dots.splice(index, 1);
    }
  });

  handleElasticCollisions();

  // Calculate attraction forces between particles
  dots.forEach((dot1, i) => {
    dots.forEach((dot2, j) => {
      if (i !== j) {
        const dx = dot2.x - dot1.x;
        const dy = dot2.y - dot1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const attractionForce = (dot1.attractionForce * dot2.attractionForce) / (distance * distance) - (dot1.gravity*dot2.gravity);

        dot1.vx += (attractionForce * dx) / distance;
        dot1.vy += (attractionForce * dy) / distance;
        dot2.vx -= (attractionForce * dx) / distance;
        dot2.vy -= (attractionForce * dy) / distance;
      }
    });
  });

  // Call the createDot function if the number of dots on the canvas is less than a certain limit
  if (dots.length < 10) {
    createDot();
  }

  // Use a forEach loop to create dots and store values in the dots array
  dots.forEach((dot) => {
    ctx.fillStyle = dot.color;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 4
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });

  // Reset clickedDot after drawing
  clickedDot = null;
}

// Function to handle resizing of the canvas
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;

  // Adjust canvas size and scale for high DPI displays
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(pixelRatio, pixelRatio);

  // Redraw the dots after resizing
  moveDots();
}

// Add an event listener to handle window resizing
window.addEventListener('resize', handleResize);

// Function to animate the dots
function animate() {
  moveDots();
  requestAnimationFrame(animate);
}

// Start the animation loop
animate();
