import { useRef, useEffect, useState } from "react";
import {
  pollPositionAllAxes,
  CLEAR_SPEED_TIMER_MS,
} from "../../helpers/inertialPositionTracking";
import { useDeviceMotionListener, useDeviceOrientationListener } from "../";
import { Inertial3DContextModel } from "../../models";

import Quaternion from "quaternion";
const rad = Math.PI / 180;

const useInertialPositonTracking = ({
  orientationSource = "magnetometer" || "gyroscope",
  orientationRefMode = "absolute" || "deltas",
  accelerationMode = "",
  computeQuaternions = false, // computeQuaternions = true | false
  isOrientationListenerOn,
  isMotionListenerOn,
  isTrueNorthOn,
  //  Callbacks
  onIMUUpdateMotionData,
  onIMUUpdateOrientationData,
}) => {
  //  State
  const [_orientationSource, set_orientationSource] =
    useState(orientationSource);
  const [_orientationRefMode, set_orientationRefMode] =
    useState(orientationRefMode);
  const [_accelerationMode, set_accelerationMode] = useState(accelerationMode);
  const [_computeQuaternions, set_computeQuaternions] =
    useState(computeQuaternions);
  const [_isOrientationListenerOn, set_isOrientationListenerOn] = useState(
    isOrientationListenerOn ?? false,
  );
  const [_isMotionListenerOn, set_isMotionListenerOn] = useState(
    isMotionListenerOn ?? false,
  );
  const [_callbacks, set_callbacks] = useState({
    onIMUUpdateMotionData,
    onIMUUpdateOrientationData,
  });
  const [_trueNorthEnabled, set_trueNorthEnabled] = useState(isTrueNorthOn);
  const [_trueNorthDelta, set_trueNorthDelta] = useState(0);
  //  TODO :: Missing isTracking state
  //  Refs
  const dataRef = useRef(new Inertial3DContextModel());
  const clearSpeedTimerRef = useRef();

  const get3DInertialContextData = () => dataRef.current;

  const _pollAccelerationFromDeviceMotion = (data) => {
    dataRef.current.updateAcceleration(
      data.acceleration.x,
      data.acceleration.y,
      data.acceleration.z,
    );
  };

  // Accelerometer with gravity
  const _pollAccelerationWithGFromDeviceMotion = (data) => {
    dataRef.current.updateAcceleration(
      data.accelerationIncludingGravity.x,
      data.accelerationIncludingGravity.y,
      data.accelerationIncludingGravity.z,
    );
  };

  // Update gyroscope
  const _pollOrientationFromDeviceMotion = (data) => {
    dataRef.current.updateRotation(
      data.rotationRate.alpha,
      data.rotationRate.beta,
      data.rotationRate.gamma,
    );
  };

  // Update magnetometer
  const _pollOrientationFromDeviceOrientation = (data) => {
    _trueNorthEnabled;
    const trueAlpha = _trueNorthEnabled
      ? (data.alpha + _trueNorthDelta) % 360
      : data.alpha;
    _computeQuaternions
      ? dataRef.current.updateRotation({
          y: trueAlpha,
          p: data.beta,
          r: data.gamma,
          q: Quaternion.fromEuler(
            trueAlpha * rad,
            data.beta * rad,
            data.gamma * rad,
            "ZXY",
          ),
        })
      : dataRef.current.updateRotation({
          y: trueAlpha,
          p: data.beta,
          r: data.gamma,
        });
  };

  const updateOrientationData = (data) => {
    _orientationSource === "magnetometer"
      ? _pollOrientationFromDeviceOrientation(data)
      : _pollOrientationFromDeviceMotion(data);
    // console.log("there", _callbacks.onIMUUpdateOrientationData);
    _callbacks.onIMUUpdateOrientationData?.(data);
  };

  const updateMotionData = (data) => {
    // console.log(data);
    _accelerationMode === "gravity"
      ? _pollAccelerationWithGFromDeviceMotion(data)
      : _pollAccelerationFromDeviceMotion(data);
    _callbacks.onIMUUpdateMotionData?.(data);
  };

  const { startDeviceOrientationListener, stopDeviceOrientationListener } =
    useDeviceOrientationListener({
      callback: (data) => updateOrientationData(data),
      olOnGetTrueNorthDelta: set_trueNorthDelta,
    });

  const { startDeviceMotionListener, stopDeviceMotionListener } =
    useDeviceMotionListener({
      callback: (data) => updateMotionData(data),
    });

  const startTracking = () => {
    console.log(
      "Start",
      _orientationRefMode,
      _isOrientationListenerOn,
      _isMotionListenerOn,
      _callbacks,
    );
    _isOrientationListenerOn && startDeviceOrientationListener();
    _isMotionListenerOn && startDeviceMotionListener();
    //  Start speed clearing timeout
    // console.log(dataRef.current);
    clearSpeedTimerRef.current =
      _isOrientationListenerOn || _isMotionListenerOn
        ? setTimeout(
            () => dataRef.current.setPreviousVelocity({ vx: 0, vy: 0, vz: 0 }),
            CLEAR_SPEED_TIMER_MS,
          )
        : null;
  };
  const stopTracking = () => {
    stopDeviceOrientationListener();
    stopDeviceMotionListener();
  };

  const refreshITP = () => pollPositionAllAxes.apply(dataRef.current);

  useEffect(() => {
    const _thisclearSpeedTimerRef = clearSpeedTimerRef.current;
    return () => {
      dataRef.current = null;
      clearTimeout(_thisclearSpeedTimerRef);
      stopDeviceOrientationListener();
      stopDeviceMotionListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    get3DInertialContextData,
    startTracking,
    stopTracking,
    refreshITP,
    setOrientationSource: set_orientationSource,
    setAccelerationMode: set_accelerationMode,
    setOrientationRefMode: set_orientationRefMode,
    setcomputeQuaternions: set_computeQuaternions,
    imuEnableOrientationLister: () => set_isOrientationListenerOn(true),
    imuDisableOrientationLister: () => set_isOrientationListenerOn(false),
    imuEnableMotionLister: () => set_isMotionListenerOn(true),
    imuDisableMotionLister: () => set_isMotionListenerOn(false),
    imuGetCallbacks: () => _callbacks,
    //  TODO :: make set and add callbacks functions
    imuSetCallbacks: (cb) => set_callbacks({ ..._callbacks, ...cb }),
    imuEnableTrueNorthCompensation: () => () => set_trueNorthEnabled(true),
    imuDisableTrueNorthCompensation: () => () => set_trueNorthEnabled(false),
  };
};
export default useInertialPositonTracking;
