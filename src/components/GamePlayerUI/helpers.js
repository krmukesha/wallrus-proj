import * as resizeMode from "./constants/resizeModes";

let thisResizeMode;

let matchViewportResolution;
// TODO: Remove this - workaround because of bug causing UE to crash when switching resolutions too quickly
let lastTimeResized = new Date().getTime();
let resizeTimeout;

function updateVideoStreamSize() {
  if (!matchViewportResolution) {
    return;
  }

  let now = new Date().getTime();
  if (now - lastTimeResized > 1000) {
    let playerElement = document.getElementById("player");
    if (!playerElement) return;

    let descriptor = {
      Console: `setres ${playerElement.clientWidth}x${playerElement.clientHeight}`,
    };
    // emitUIInteraction(descriptor);
    console.log(descriptor);
    lastTimeResized = new Date().getTime();
  } else {
    console.log("Resizing too often - skipping");
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateVideoStreamSize, 1000);
  }
}

// eslint-disable-next-line no-unused-vars
let playerElementClientRect;
// let normalizeAndQuantizeUnsigned = undefined;
// let normalizeAndQuantizeSigned = undefined;

// resizePlayerStyle vars
let styleWidth;
let styleHeight;
let styleTop;
let styleLeft;
let styleCursor = "default";
let styleAdditional;

function resizePlayerStyleToFillWindow(playerElement) {
  console.log("resizePlayerStyleToFillWindow");

  let videoElement = playerElement.getElementsByTagName("VIDEO");

  // Fill the player display in window, keeping picture's aspect ratio.
  let windowAspectRatio = window.innerHeight / window.innerWidth;
  let playerAspectRatio =
    playerElement.clientHeight / playerElement.clientWidth;
  // We want to keep the video ratio correct for the video stream
  let videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;
  if (isNaN(videoAspectRatio)) {
    //Video is not initialised yet so set playerElement to size of window
    styleWidth = window.innerWidth;
    styleHeight = window.innerHeight;
    styleTop = 0;
    styleLeft = 0;
    playerElement.style = `top: ${styleTop}px; left: ${styleLeft}px; width: ${styleWidth}px; height: ${styleHeight}px; cursor: ${styleCursor}; ${styleAdditional}`;
  } else if (windowAspectRatio < playerAspectRatio) {
    // Window height is the constraining factor so to keep aspect ratio change width appropriately
    styleWidth = Math.floor(window.innerHeight / videoAspectRatio);
    styleHeight = window.innerHeight;
    styleTop = 0;
    styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
    //Video is now 100% of the playerElement, so set the playerElement style
    playerElement.style = `top: ${styleTop}px; left: ${styleLeft}px; width: ${styleWidth}px; height: ${styleHeight}px; cursor: ${styleCursor}; ${styleAdditional}`;
  } else {
    // Window width is the constraining factor so to keep aspect ratio change height appropriately
    styleWidth = window.innerWidth;
    styleHeight = Math.floor(window.innerWidth * videoAspectRatio);
    styleTop = Math.floor((window.innerHeight - styleHeight) * 0.5);
    styleLeft = 0;
    //Video is now 100% of the playerElement, so set the playerElement style
    playerElement.style = `top: ${styleTop}px; left: ${styleLeft}px; width: ${styleWidth}px; height: ${styleHeight}px; cursor: ${styleCursor}; ${styleAdditional}`;
  }
}

function resizePlayerStyleToActualSize(playerElement) {
  console.log("resizePlayerStyleToActualSize");

  let videoElement = playerElement.getElementsByTagName("VIDEO");

  if (videoElement.length > 0) {
    // Display image in its actual size
    styleWidth = videoElement[0].videoWidth;
    styleHeight = videoElement[0].videoHeight;
    styleTop = Math.floor((window.innerHeight - styleHeight) * 0.5);
    styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
    //Video is now 100% of the playerElement, so set the playerElement style
    playerElement.style = `top: ${styleTop}px; left: ${styleLeft}px; width: ${styleWidth}px; height: ${styleHeight}px; cursor: ${styleCursor}; ${styleAdditional}`;
  }
}

function resizePlayerStyleToArbitrarySize(playerElement) {
  console.log("resizePlayerStyleToArbitrarySize");

  // let videoElement = playerElement.getElementsByTagName("VIDEO");
  //Video is now 100% of the playerElement, so set the playerElement style
  playerElement.style = `top: 0px; left: 0px; width: ${styleWidth}px; height: ${styleHeight}px; cursor: ${styleCursor}; ${styleAdditional}`;
}

function resizePlayerStyle(selector = "#player") {
  let playerElement = document.querySelector(selector);

  if (!playerElement) return;

  updateVideoStreamSize();

  if (playerElement.classList.contains("fixed-size")) return;

  switch (thisResizeMode) {
    case resizeMode.FILL_WINDOW:
      resizePlayerStyleToFillWindow(playerElement);
      break;
    case resizeMode.ACTUAL_SIZE:
      resizePlayerStyleToActualSize(playerElement);
      break;
    case resizeMode.ARBITRARY:
      resizePlayerStyleToArbitrarySize(playerElement);
      break;
    default:
      console.error("Undefined resize mode");
  }

  // let checkBox = document.querySelector('#enlarge-display-to-fill-window-tgl') || 1;
  // let windowSmallerThanPlayer = window.innerWidth < playerElement.videoWidth || window.innerHeight < playerElement.videoHeight;
  // if (checkBox !== null) {
  // 	if (checkBox.checked || windowSmallerThanPlayer) {
  // 		resizePlayerStyleToFillWindow(playerElement);
  // 	} else {
  // 		resizePlayerStyleToActualSize(playerElement);
  // 	}
  // } else {
  // 	resizePlayerStyleToActualSize(playerElement);
  // }

  // Calculating and normalizing positions depends on the width and height of
  // the player.
  playerElementClientRect = playerElement.getBoundingClientRect();
  // setupNormalizeAndQuantize();
  // resizeFreezeFrameOverlay();
}

// Fix for bug in iOS where windowsize is not correct at instance or orientation change
// https://github.com/dimsemenov/PhotoSwipe/issues/1315
let _orientationChangeTimeout;
function onOrientationChange() {
  clearTimeout(_orientationChangeTimeout);
  _orientationChangeTimeout = setTimeout(function () {
    resizePlayerStyle();
  }, 500);
}

const setResizeMode = (mode) => (thisResizeMode = mode);

function setupEvents({ resizeMode }) {
  console.log("Setting up events");
  thisResizeMode = resizeMode;

  window.addEventListener("resize", resizePlayerStyle, true);
  window.addEventListener("orientationchange", onOrientationChange);

  let matchViewportResolutionCheckBox = document.getElementById(
    "match-viewport-res-tgl",
  );
  if (matchViewportResolutionCheckBox !== null) {
    matchViewportResolutionCheckBox.onchange = function () {
      matchViewportResolution = matchViewportResolutionCheckBox.checked;
    };
  }

  resizePlayerStyle();
}

export { setupEvents, setResizeMode, resizePlayerStyle };
