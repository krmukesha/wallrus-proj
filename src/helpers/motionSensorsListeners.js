// export const getDeviceMotionListener = (callback) =>
//   (window.hasOwnProperty("ondevicemotion") &&
//     window.addEventListener("devicemotion", callback)) ||
//   window.ondevicemotion;
// export const getDeviceOrientationListener = (callback) =>
//   (window.hasOwnProperty("ondeviceorientation") &&
//     window.addEventListener("deviceorientation", callback)) ||
//   window.ondeviceorientation;
// export const removeDeviceMotionListener = (callback) =>
//   window.hasOwnProperty("ondevicemotion") &&
//   window.addEventListener("devicemotion", callback);
// export const removeDeviceOrientationListener = (callback) =>
//   window.hasOwnProperty("ondeviceorientation") &&
//   window.addEventListener("deviceorientation", callback);

//V2 TODO :: Try throwing errors for each case
// a) The browser supports / does not support this
// b) There's already a listener attached.
export const getDeviceMotionListener = (callback) =>
  Object.prototype.hasOwnProperty.call(window, "ondevicemotion") &&
  (window.ondevicemotion = callback);
export const removeDeviceMotionListener = () =>
  Object.prototype.hasOwnProperty.call(window, "ondevicemotion") &&
  !(window.ondevicemotion = null);
export const getDeviceOrientationListener = (callback) =>
  Object.prototype.hasOwnProperty.call(window, "ondeviceorientation") &&
  (window.ondeviceorientation = callback);
export const removeDeviceOrientationListener = () =>
  Object.prototype.hasOwnProperty.call(window, "ondeviceorientation") &&
  !(window.ondeviceorientation = null);
