import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;

const ctx = canvas.getContext("2d")!;

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const circleRadius = 50; // Adjust the size of the circle here
const speedanimation = 2 ; // speed of the dot animation 
const animationInterval = setInterval(draw, 10); // Adjust the interval for the desired animation speed

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, width, height);

const dotcolor = "#ff0000"; // put the color in  const  for change easy early the color
ctx.fillStyle = dotcolor ;  
 // make the first dot of start 
let dot1 = { x: circleRadius, y: circleRadius };
let dot2 = { x: canvas.width - circleRadius, y: circleRadius };
let dot3 = { x: circleRadius, y: canvas.height - circleRadius };
let dot4 = { x: canvas.width - circleRadius, y: canvas.height - circleRadius };

 //function who make the dot  
function makedot(x : number , y: number ) {
    ctx.fillStyle = dotcolor;     
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
    ctx.fill();
}
//function who move the dot and stop if the dot arrive in the middle
function draw() {
    ctx.clearRect(0, 0, width, height); // clean the canevas of the present dot 

    // part of the function who can move the 4 dot in diagonal
    dot1.x += speedanimation;
    dot1.y += speedanimation;
  
    dot2.x -= speedanimation;
    dot2.y += speedanimation;
  
    dot3.x += speedanimation;
    dot3.y -= speedanimation;
  
    dot4.x -= speedanimation;
    dot4.y -= speedanimation;
  
    //call the function makedot for draw the dot
  makedot(dot1.x, dot1.y);
  makedot(dot2.x, dot2.y);
  makedot(dot3.x, dot3.y);
  makedot(dot4.x, dot4.y);
 
  //put in a variable the value of middle of the canevas 
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  if (
    dot1.x >= centerX &&
    dot2.x <= centerX &&
    dot3.x >= centerX &&
    dot4.x <= centerX &&
    dot1.y >= centerY &&
    dot2.y >= centerY &&
    dot3.y <= centerY &&
    dot4.y <= centerY
  ) {
    clearInterval(animationInterval);  //clean the interval of animation 
  }
}



 
