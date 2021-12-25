import { useContext } from "react";
import { PermissionsContext } from "../../contexts";
import * as camActionTypes from "../../constants/cameraActionTypes";
import * as motActionTypes from "../../constants/motionSensorsActionTypes";
import * as ortActionTypes from "../../constants/orientationSensorsActionTypes";
import { useDispatch } from "../";

import {
  getMotionSensorAccess,
  getOrientationSensorAccess,
} from "../../helpers/peripheralsAccess";

const usePermissions = () => {
  const { state } = useContext(PermissionsContext);
  const dispatch = useDispatch(PermissionsContext);

  const _requestPermissions = async (
    mediaConstraints,
    grantActionType,
    denyActionType,
  ) => {
    try {
      (await navigator.mediaDevices.getUserMedia(mediaConstraints)) &&
        dispatch({ type: grantActionType });
    } catch (e) {
      if (e.name === "PermissionDeniedError") {
        dispatch({ type: denyActionType });
        return;
      }
      console.error(e);
    }
  };

  const requestCameraPermissions = (
    mediaConstraints = {
      audio: false,
      video: true,
    },
  ) => {
    _requestPermissions(
      mediaConstraints,
      camActionTypes.CAM_GRANT_PERMS,
      camActionTypes.CAM_DENY_PERMS,
    );
  };

  const requestDeviceMotionPermissions = () => {
    dispatch({
      type: getMotionSensorAccess()
        ? motActionTypes.MOSENS_GRANT_PERMS
        : motActionTypes.MOSENS_DENY_PERMS,
    });
  };

  const requestDeviceOrientationPermissions = () => {
    getOrientationSensorAccess();
    dispatch({ type: ortActionTypes.ORSENS_GRANT_PERMS });
  };

  return {
    cameraPermissionsState: state.camera,
    requestCameraPermissions,
    requestDeviceMotionPermissions,
    requestDeviceOrientationPermissions,
  };
};
export default usePermissions;
