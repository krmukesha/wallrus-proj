import React, { useReducer } from "react";
import PropTypes from "prop-types";

import * as camStates from "../constants/cameraStates";
import * as permsStates from "../constants/permissionStates";
import * as mosensStates from "../constants/motionSensorsStates";
import * as orsensStates from "../constants/orientationSensorsStates";
import { PermissionsReducer } from "../reducers";
import { PermissionsContext } from "./";
import {
  checkMediaAccess,
  checkMotionSensorsAccess,
} from "../helpers/peripheralsAccess";

const mapCameraPermissions = (permissionState) => {
  switch (permissionState) {
    case permsStates.PERMS_STATE_PROMPT:
      return camStates.CAM_PERMS_NOT_REQUESTED;
    case permsStates.PERMS_STATE_GRANTED:
      return camStates.CAM_PERMS_GRANTED;
    case permsStates.PERMS_STATE_DENIED:
      return camStates.CAM_PERMS_DENIED;
    default:
      break;
  }
};

const mapDeviceMotionPermissions = (permissionState) => {
  switch (permissionState) {
    case permsStates.PERMS_STATE_PROMPT:
      return mosensStates.MOSENS_PERMS_NOT_REQUESTED;
    case permsStates.PERMS_STATE_GRANTED:
      return mosensStates.MOSENS_PERMS_GRANTED;
    case permsStates.PERMS_STATE_DENIED:
      return mosensStates.MOSENS_PERMS_DENIED;
    default:
      break;
  }
};

const mapDeviceOrientationPermissions = (permissionState) => {
  switch (permissionState) {
    case permsStates.PERMS_STATE_PROMPT:
      return orsensStates.ORSENS_PERMS_NOT_REQUESTED;
    case permsStates.PERMS_STATE_GRANTED:
      return orsensStates.ORSENS_PERMS_GRANTED;
    case permsStates.PERMS_STATE_DENIED:
      return orsensStates.ORSENS_PERMS_DENIED;
    default:
      break;
  }
};

const GlobalContext = ({ children }) => {
  const { camera } = checkMediaAccess();
  const { accelerometer, magnetometer, gyroscope } = checkMotionSensorsAccess();

  const [state, dispatch] = useReducer(PermissionsReducer, {
    camera: mapCameraPermissions(camera) || camStates.CAM_PERMS_NOT_REQUESTED,
    accelerometer:
      mapDeviceMotionPermissions(accelerometer) ||
      mosensStates.MOSENS_PERMS_NOT_REQUESTED,
    gyroscope:
      mapDeviceMotionPermissions(gyroscope) ||
      mosensStates.MOSENS_PERMS_NOT_REQUESTED,
    magnetometer:
      mapDeviceOrientationPermissions(magnetometer) ||
      orsensStates.ORSENS_PERMS_NOT_REQUESTED,
  });

  return (
    <PermissionsContext.Provider value={{ state, dispatch }}>
      {children}
    </PermissionsContext.Provider>
  );
};
GlobalContext.propTypes = {
  children: PropTypes.object,
};

export default GlobalContext;
