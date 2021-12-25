import * as PERMS_STATES from "../constants/permissionStates";
import {
  getDeviceMotionListener,
  removeDeviceMotionListener,
  getDeviceOrientationListener,
  removeDeviceOrientationListener,
} from "./motionSensorsListeners";

let mediaPermissions = {
  camera: PERMS_STATES.PERMS_STATE_PROMPT,
  microphone: PERMS_STATES.PERMS_STATE_PROMPT,
};

let motionSensorsPermissions = {
  accelerometer: PERMS_STATES.PERMS_STATE_PROMPT,
  magnetometer: PERMS_STATES.PERMS_STATE_PROMPT,
  gyroscope: PERMS_STATES.PERMS_STATE_PROMPT,
};

const DEBUG = true;

/**
 *
 * @param {*} permissionName
 * @param {*} obj
 * @returns
 */
// const checkWithPermissionsQuery = (permissionName, obj) =>
const checkWithPermissionsQuery = (permissionName) =>
  navigator.permissions
    .query({ name: permissionName })
    .then((res) => {
      if (res.state === "granted") {
        DEBUG && console.log(`Has permissions for ${permissionName}`);
        // obj = PERMS_STATES.PERMS_STATE_GRANTED;
      } else {
        DEBUG && console.log(`Does not have permissions for ${permissionName}`);
        // obj = PERMS_STATES.PERMS_STATE_DENIED;
      }
      return true;
    })
    .catch((e) => {
      DEBUG &&
        console.log("Does not support navigator.permissions. Error: ", e);
      return false;
    });

const checkMediaAccessExperimental = () =>
  checkWithPermissionsQuery("camera", mediaPermissions.camera) &&
  checkWithPermissionsQuery("microphone", mediaPermissions.microphone);

const checkMotionSensorsAccessExperimental = () =>
  checkWithPermissionsQuery(
    "accelerometer",
    motionSensorsPermissions.accelerometer,
  ) &&
  checkWithPermissionsQuery(
    "magnetometer",
    motionSensorsPermissions.magnetometer,
  ) &&
  checkWithPermissionsQuery("gyroscope", motionSensorsPermissions.gyroscope);

const checkMotionSensorsAccess = async () => {
  if (navigator.permissions && checkMotionSensorsAccessExperimental())
    return motionSensorsPermissions;
  return motionSensorsPermissions;
};

const checkMediaAccess = async () => {
  // (navigator.permissions && checkExperimental()) ||
  //   console.log("Does not support navigator.permissions");
  if (navigator.permissions && checkMediaAccessExperimental())
    return mediaPermissions;

  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    DEBUG && console.log("No mediaDevices permissions");
  } else {
    navigator.mediaDevices.enumerateDevices().then((devices) =>
      devices.forEach((device) => {
        console.log(device);
        if (device.kind === "audioinput" && device.label) {
          DEBUG && console.log("Has Audio Access");
          mediaPermissions.microphone = PERMS_STATES.PERMS_STATE_GRANTED;
        }
        if (device.kind === "videoinput" && device.label) {
          DEBUG && console.log("Has Video Access");
          mediaPermissions.camera = PERMS_STATES.PERMS_STATE_GRANTED;
        }
      }),
    );
  }
  return mediaPermissions;
};

// TODO : Finish
const getMediaAccess = (mediaConstraints) => mediaConstraints;

// TODO : Finish
const getCameraAccess = (mediaConstraints) => mediaConstraints;

// TODO : Finish
const getMicrophoneAccess = (mediaConstraints) => mediaConstraints;

const getMotionSensorAccess = () => {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // (optional) Do something before API request prompt.
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        // (optional) Do something after API prompt dismissed.
        if (response === "granted") {
          const stubFunc = () => {};
          getDeviceMotionListener(stubFunc);
          removeDeviceMotionListener(stubFunc);
        } else {
          return false;
        }
      })
      .catch((e) => {
        console.error(e);
        return false;
      });
  } else {
    alert("DeviceMotionEvent is not defined");
    return false;
  }
};
const getOrientationSensorAccess = () => {
  const stubFunc = () => {};
  getDeviceOrientationListener(stubFunc);
  removeDeviceOrientationListener(stubFunc);
};

export {
  checkMotionSensorsAccess,
  checkMediaAccess,
  getMediaAccess,
  getCameraAccess,
  getMicrophoneAccess,
  getMotionSensorAccess,
  getOrientationSensorAccess,
};
