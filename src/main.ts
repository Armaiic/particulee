import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;

const ctx = canvas.getContext("2d")!;

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, width, height);

ctx.fillStyle = "#ff0000";
const circleRadius = 20; // Adjust the size of the circle here
const circleX =  100 ; // Position the circle on the left
const circleY = 250 ; // Position the circle at the top
ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
ctx.fill();
