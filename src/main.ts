import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;

const ctx = canvas.getContext("2d")!;

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, width, height);

ctx.fillStyle = "#ffffff";
ctx.arc(width / 2, height / 2, 10, 0, Math.PI * 2);
ctx.fill();
