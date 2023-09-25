// Import the CSS file for styling
import "./style.css";

// Get a reference to the canvas element and set its dimensions
const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;
const ctx = canvas.getContext("2d")!;
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Define the radius of the circles and export it
const circleRadius = 80; // Radius of the circles (can be adjusted)
const blockingRadius = circleRadius * 2; // Minimum distance for blocking interaction
const savedistance = circleRadius * 2; // Minimum distance between dots
let mouseX = 0; // Horizontal position of the mouse
let mouseY = 0; // Vertical position of the mouse

// Update mouseX and mouseY when the mouse moves over the canvas
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// Function to create a new dot on the canvas
function makedot() {
  // Generate random coordinates for the dot within the canvas size
  const randomCoordinates = getRandomCoordinates();
  const { x, y } = randomCoordinates;

  // Generate random velocity for the dot
  const { vx, vy } = getRandomVelocity();

  // Get a random color for the dot
  const color = getRandomHexColor();

  let isok = true;

  // Calculate the distance from the dot to the cursor
  const distanceToCursor = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);

  // Check if the dot is too close to other dots or the cursor
  for (const dot of dots) {
    // Calculate the distance between the new dot and existing dots
    const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);

    // Check if the new dot is too close to others or the cursor
    if (distance < savedistance || distanceToCursor < blockingRadius) {
      isok = false;
      break;
    }
  }

  // If the dot is not too close to others or the cursor, add it to the array
  if (isok) {
    dots.push({ x, y, vx, vy, color });
  }
}

// Create an array to store the dots and their positions
const dots: { x: number; y: number; vx: number; vy: number; color: string }[] = [];

// Function to generate random x and y coordinates within the canvas size
function getRandomCoordinates() {
  const safeborder = circleRadius * 2;
  const x =
    Math.random() * (width - safeborder * 2) + safeborder;
  const y =
    Math.random() * (height - safeborder * 2) + safeborder;
  return { x, y };
}

// Function to generate random velocity for the dots
function getRandomVelocity() {
  // Define the range of random speeds for the dots
  const minSpeed = 2; // Minimum speed
  const maxSpeed = 16; // Maximum speed

  // Generate random velocities with random directions (positive or negative)
  const vx =
    (Math.random() * (maxSpeed - minSpeed) + minSpeed) *
    (Math.random() < 0.5 ? -1 : 1); // Random horizontal velocity
  const vy =
    (Math.random() * (maxSpeed - minSpeed) + minSpeed) *
    (Math.random() < 0.5 ? -1 : 1); // Random vertical velocity
  return { vx, vy };
}

// Function to generate a random hex color
function getRandomHexColor(): string {
  var randomcolor = "#"; // Initialize the hex color string
  var letters = "0123456789ABCDEF"; // Hexadecimal characters

  // Generate a random 6-character hex color code
  for (var i = 0; i < 6; i++) {
    randomcolor += letters[Math.floor(Math.random() * 16)]; // Add a random character
  }
  return randomcolor; // Return the random hex color code
}

// Function to check for collisions between dots
function checkCollisions() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dot1 = dots[i];
      const dot2 = dots[j];

      const distance = calculateDistance(dot1.x, dot1.y, dot2.x, dot2.y);

      if (distance < circleRadius * 2) {
        // Handle collision by swapping velocities
        const tempVx = dot1.vx;
        const tempVy = dot1.vy;

        dot1.vx = dot2.vx;
        dot1.vy = dot2.vy;

        dot2.vx = tempVx;
        dot2.vy = tempVy;
      }
    }
  }
}

// Function to move the dots on the canvas
function moveDots() {
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  // Update the position of each dot and handle bouncing off the canvas edges
  dots.forEach((dot, index) => {
    // Update the dot's position based on its velocity
    dot.x += dot.vx;
    dot.y += dot.vy;

    // Check if the dot is outside the canvas boundaries and reverse its velocity if needed
    if (dot.x - circleRadius < 0 || dot.x + circleRadius > width) {
      dot.vx *= -1; // Reverse horizontal velocity to bounce off walls
      dot.color = getRandomHexColor(); // Change the dot's color when it hits the wall
    }
    if (dot.y - circleRadius < 0 || dot.y + circleRadius > height) {
      dot.vy *= -1; // Reverse vertical velocity to bounce off walls
      dot.color = getRandomHexColor(); // Change the dot's color when it hits the wall
    }

    // Remove dots that have moved outside the canvas
    if (dot.x < 0 || dot.x > width || dot.y < 0 || dot.y > height) {
      dots.splice(index, 1); // Remove the dot from the array
    }

    const distanceToCursor = calculateDistance(dot.x, dot.y, mouseX, mouseY);
    // Check if the dot is within the circle around the cursor

    if (distanceToCursor < circleRadius + blockingRadius) {
      // Calculate the angle between the dot and the cursor
      const angle = Math.atan2(dot.y - mouseY, dot.x - mouseX);
      // Calculate the amount to push the dot away
      const pushDistance = circleRadius + blockingRadius - distanceToCursor;
      const pushX = pushDistance * Math.cos(angle);
      const pushY = pushDistance * Math.sin(angle);

      // Update the dot's position to push it away from the cursor
      dot.x += pushX;
      dot.y += pushY;
      dot.color = getRandomHexColor();
    }
  });

  // Check for collisions between dots
  checkCollisions();

  // Add new dots if the number of dots is below a certain threshold
  if (dots.length < 50) {
    makedot(); // Create a new dot
  }

  // Draw each dot on the canvas
  dots.forEach((dot) => {
    ctx.fillStyle = dot.color; // Set the dot's fill color
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, circleRadius, 0, Math.PI * 2); // Draw a filled circle
    ctx.fill(); // Fill the circle
    ctx.closePath();
  });
}

// Start moving dots with a set interval for animation (60 frames per second)
setInterval(moveDots, 1000 / 60); // Update every 1/60th of a second for smooth animation

// Initial dot creation
for (let i = 0; i < 1; i++) {
  makedot(); // Create 100 initial dots
}

// Initial draw of the dots
moveDots(); // Draw the dots initially