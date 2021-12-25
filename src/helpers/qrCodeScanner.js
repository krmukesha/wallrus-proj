import jsQR from "jsqr";
import { stopStreamedVideo } from "./webRTCVideo";

let mode;
let scanRoutineInterval;
let scannerConfig = {
  scanWidthArea: 400,
  scanHeightArea: 400,
  scanOptions: {
    inversionAttempts: "dontInvert",
  },
};
let trackHandler;
let trackWidth;
let trackHeight;
let successCallback;

// For Canvas
let videoHandler;
let canvasHandler;
let canvasContext;

const DEBUG = true;

const initCanvas = () => {
  const { height, width } = trackHandler.getSettings();
  canvasHandler = document.createElement("canvas");
  canvasHandler.width = width;
  canvasHandler.height = height;
  canvasContext = canvasHandler.getContext("2d");
};

const getCanvasSnapshotImageData = () => {
  canvasContext.drawImage(videoHandler, 0, 0, trackWidth, trackHeight);
  return canvasContext.getImageData(
    (trackWidth - scannerConfig.scanWidthArea) / 2,
    (trackHeight - scannerConfig.scanHeightArea) / 2,
    scannerConfig.scanWidthArea,
    scannerConfig.scanHeightArea,
  );
};

const getImageCapture = async () => {
  videoHandler.play();
  const imageCapture = new ImageCapture(trackHandler);
  let frame;
  try {
    frame = await imageCapture.grabFrame();
  } catch (e) {
    console.error("Error while grabbing frame: ", e);
  }
  DEBUG && console.log(`frame type: ${typeof frame}`, { frame });
  return frame;
};

const detectQRCode = ({ imageData }) =>
  jsQR(
    imageData,
    scannerConfig.scanWidthArea,
    scannerConfig.scanHeightArea,
    scannerConfig.scanOptions,
  );

const getImageData = () =>
  mode ? getImageCapture() : getCanvasSnapshotImageData();

const scanRoutine = () => {
  const imageData = getImageData();

  const reading = detectQRCode({
    imageData: imageData.data,
  });
  DEBUG && console.table(reading);
  successCallback && reading && successCallback(reading);
};

const clearQRCodeReader = () => {
  clearInterval(scanRoutineInterval);
  videoHandler && videoHandler.srcObject && stopStreamedVideo(videoHandler);
  return true;
};

const initQRCodeReader = (
  { vdHandler, trHandler, scanInterval = 1000, config, callback },
  experimental = false,
) => {
  mode = experimental;
  scannerConfig = (config && { ...config }) || scannerConfig;
  videoHandler = vdHandler;
  trackHandler = trHandler;
  successCallback = callback;

  const { height, width } = trackHandler.getSettings();
  trackWidth = width;
  trackHeight = height;

  // if experimental:
  !mode && initCanvas();

  scanRoutineInterval = setInterval(scanRoutine, scanInterval);
};
export { initQRCodeReader, clearQRCodeReader };
