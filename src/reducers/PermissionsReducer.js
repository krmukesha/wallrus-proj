import * as camActionTypes from "../constants/cameraActionTypes";
import * as camStates from "../constants/cameraStates";

import * as orsensActionTypes from "../constants/orientationSensorsActionTypes";
import * as orsensStates from "../constants/orientationSensorsStates";
import * as mosensActionTypes from "../constants/motionSensorsActionTypes";
import * as mosensStates from "../constants/motionSensorsStates";

const camPermissionsReducer = (state, action) => {
  switch (action.type) {
    case camActionTypes.CAM_REQUEST_PERMS:
      return camStates.CAM_PERMS_REQUESTED;
    case camActionTypes.CAM_GRANT_PERMS:
      return camStates.CAM_PERMS_GRANTED;
    case camActionTypes.CAM_DENY_PERMS:
      return camStates.CAM_PERMS_DENIED;
    case camActionTypes.CAM_REVOKE_PERMS:
      return camStates.CAM_PERMS_REVOKED;
    default:
      return state;
  }
};

const motionSensorPermissionsReducer = (state, action) => {
  switch (action.type) {
    case mosensActionTypes.MOSENS_REQUEST_PERMS:
      return mosensStates.MOSENS_PERMS_REQUESTED;
    case mosensActionTypes.MOSENS_GRANT_PERMS:
      return mosensStates.MOSENS_PERMS_GRANTED;
    case mosensActionTypes.MOSENS_DENY_PERMS:
      return mosensStates.MOSENS_PERMS_DENIED;
    case mosensActionTypes.MOSENS_REVOKE_PERMS:
      return mosensStates.MOSENS_PERMS_REVOKED;
    default:
      return state;
  }
};

const orientationSensorPermissionsReducer = (state, action) => {
  switch (action.type) {
    case orsensActionTypes.ORSENS_REQUEST_PERMS:
      return orsensStates.ORSENS_PERMS_REQUESTED;
    case orsensActionTypes.ORSENS_GRANT_PERMS:
      return orsensStates.ORSENS_PERMS_GRANTED;
    case orsensActionTypes.ORSENS_DENY_PERMS:
      return orsensStates.ORSENS_PERMS_DENIED;
    case orsensActionTypes.ORSENS_REVOKE_PERMS:
      return orsensStates.ORSENS_PERMS_REVOKED;
    default:
      return state;
  }
};

const PermissionsReducer = (state, action) => {
  return {
    camera: camPermissionsReducer(state.camera, action),
    accelerometer: motionSensorPermissionsReducer(state.motionSensors, action),
    gyroscope: motionSensorPermissionsReducer(state.motionSensors, action),
    magnetometer: orientationSensorPermissionsReducer(
      state.motionSensors,
      action,
    ),
  };
};
export default PermissionsReducer;
