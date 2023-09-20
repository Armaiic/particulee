import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;

const ctx = canvas.getContext("2d")!;

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);


ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, width, height);

const dotcolor = "#ff0000";
ctx.fillStyle = dotcolor ;
const circleRadius = 50; // Adjust the size of the circle here
 const  numberofdot = 4
 
function makedot (x, y) {
    ctx.fillStyle = dotcolor;
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
    ctx.fill();
}

for ( let i =0; i < numberofdot; i++ ) {
    makedot(circleRadius, circleRadius);
    makedot(canvas.width - circleRadius, circleRadius);
     makedot(circleRadius, canvas.height - circleRadius);
     makedot(canvas.width - circleRadius, canvas.height - circleRadius);
}
 
