import { getRandomCoordinates, getRandomVelocity, getRandomHexColor, dots, savedistance } from "./main";

// Updated makedot function to create and store dots
export function makedot() {
  const randomCoordinates = getRandomCoordinates();
  const { x, y } = randomCoordinates;
  const { vx, vy } = getRandomVelocity();
  const color = getRandomHexColor(); // Get a random color here
  let isok = true;

  for (const dot of dots) {
    const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
    if (distance < savedistance) {
      isok = false;
      break;
    }
  }
  if (isok = true) {

    dots.push({ x, y, vx, vy, color });

  }
}
