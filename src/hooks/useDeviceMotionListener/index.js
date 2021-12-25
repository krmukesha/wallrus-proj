import { useRef, useState, useEffect } from "react";
import * as DM_STATES from "./constants";
import {
  getDeviceMotionListener,
  removeDeviceMotionListener,
} from "../../helpers/motionSensorsListeners";

const DEBUG = true;

const useDeviceMotionListener = ({ callback }) => {
  // const useDeviceMotionListener = ({ callback, callPerFrame = false }) => {
  const listenerRef = useRef();
  const dataRef = useRef();
  const [state, setstate] = useState(DM_STATES.DM_STATE_STANDBY);

  const startDeviceMotionListener = () => {
    listenerRef.current =
      // callPerFrame
      //         ? (e) => requestAnimationFrame(() => callback(e))
      //         : callback
      (callback && getDeviceMotionListener(callback)) || null;
    setstate(
      listenerRef.current
        ? DM_STATES.DM_STATE_RUNNING
        : DM_STATES.DM_STATE_ERROR,
    );
  };

  const getDeviceMotionData = () => dataRef.current;

  const stopDeviceMotionListener = () => {
    removeDeviceMotionListener(callback);
  };

  useEffect(() => {
    return () => {
      removeDeviceMotionListener(callback);
      listenerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    DEBUG && console.log({ state });
  }, [state]);

  return {
    startDeviceMotionListener,
    stopDeviceMotionListener,
    getDeviceMotionData,
  };
};
export default useDeviceMotionListener;
