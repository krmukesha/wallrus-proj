const getCompassHeading = (alpha, beta, gamma) => {
  // Convert degrees to radians
  let alphaRad = alpha * (Math.PI / 180);
  let betaRad = beta * (Math.PI / 180);
  let gammaRad = gamma * (Math.PI / 180);

  // Calculate equation components
  let cA = Math.cos(alphaRad);
  let sA = Math.sin(alphaRad);
  let cB = Math.cos(betaRad);
  let sB = Math.sin(betaRad);
  let cG = Math.cos(gammaRad);
  let sG = Math.sin(gammaRad);

  // Calculate A, B, C rotation components
  let rA = -cA * sG - sA * sB * cG;
  let rB = -sA * sG + cA * sB * cG;
  // eslint-disable-next-line no-unused-vars
  let rC = -cB * cG;

  // Calculate compass heading
  let compassHeading = Math.atan(rA / rB);

  // Convert from half unit circle to whole unit circle
  if (rB < 0) {
    compassHeading += Math.PI;
  } else if (rA < 0) {
    compassHeading += 2 * Math.PI;
  }

  // Convert radians to degrees
  compassHeading *= 180 / Math.PI;

  return compassHeading;
};

export const getTrueNorth = (event) =>
  event?.webkitCompassHeading ??
  getCompassHeading(event.alpha, event.beta, event.gamma);
// Object.hasOwnProperty.call(event, "alpha")
//   ? 1 // event.webkitCompassHeading
//   : 0; //getCompassHeading(event);
