function generateRandomColour() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  // Avoid generating grey colors
  if (r === g && g === b) {
    generateRandomColour();
  }

  return `rgb(${r}, ${g}, ${b})`;
}

export default generateRandomColour;
