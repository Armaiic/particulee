// Import the CSS file for styling
import "./style.css";

// Get a reference to the canvas element and set its dimensions
const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;
const ctx = canvas.getContext("2d")!;
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Define the radius of the circles and export it
const circleRadius = 50; // Radius of the circles (can be adjusted)
 const blockingRadius = circleRadius * 2; // Minimum distance for blocking interaction
 const savedistance = circleRadius * 2; // Minimum distance between dots
let mouseX = 0; // Horizontal position of the mouse
 let mouseY = 0; // Vertical position of the mouse

// Update mouseX and mouseY when the mouse moves over the canvas
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Function to create a new dot on the canvas
function makedot() {
  // Generate random coordinates for the dot within the canvas size
  const randomCoordinates = getRandomCoordinates();
  const { x, y } = randomCoordinates ;

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
  const safeborder = circleRadius *2  // 
  const x = Math.random() * (width - safeborder *2) + safeborder // Random x-coordinate within canvas width and in few distance of the border
  const y = Math.random() * ( height  - safeborder *2 ) + safeborder; // Random y-coordinate within canvas height
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
    if (dot.x - circleRadius < 0 || dot.x + circleRadius> width) {
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
  });

  // Add new dots if the number of dots is below a certain threshold
  if (dots.length < 1000) {
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