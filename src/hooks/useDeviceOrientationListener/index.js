import { useRef, useState, useEffect } from "react";
import * as DO_STATES from "./constants";
import {
  getDeviceOrientationListener,
  removeDeviceOrientationListener,
} from "../../helpers/motionSensorsListeners";
import { getTrueNorth } from "../../helpers/compass_helper";

const DEBUG = true;

const useDeviceOrientationListener = ({ callback, olOnGetTrueNorthDelta }) => {
  // const useDeviceOrientationListener = ({ callback, callPerFrame = false }) => {
  const listenerRef = useRef();
  const dataRef = useRef();
  const [state, setstate] = useState(DO_STATES.DO_STATE_STANDBY);
  const [_trueNorthDifference, set_trueNorthDifference] = useState(0);

  //  TODO :: Setup a try / catch routine to see if app has permissions to access data
  const _getTrueNorth = (event, callback) => {
    const delta = Math.abs(getTrueNorth(event) - event.alpha);
    set_trueNorthDifference(delta);
    olOnGetTrueNorthDelta?.(event);
    removeDeviceOrientationListener();
    listenerRef.current =
      (callback && getDeviceOrientationListener(callback)) || null;
  };

  const startDeviceOrientationListener = () => {
    listenerRef.current =
      (callback &&
        getDeviceOrientationListener((event) =>
          _getTrueNorth(event, callback),
        )) ||
      null;
    setstate(
      listenerRef.current
        ? DO_STATES.DO_STATE_RUNNING
        : DO_STATES.DO_STATE_ERROR,
    );
  };

  const getDeviceOrientationData = () => dataRef.current;

  const stopDeviceOrientationListener = () => {
    removeDeviceOrientationListener(callback);
  };

  useEffect(() => {
    return () => {
      removeDeviceOrientationListener(callback);
      listenerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    DEBUG && console.log({ state });
  }, [state]);

  return {
    startDeviceOrientationListener,
    stopDeviceOrientationListener,
    getDeviceOrientationData,
    getTrueNorthDifference: () => _trueNorthDifference,
  };
};
export default useDeviceOrientationListener;
