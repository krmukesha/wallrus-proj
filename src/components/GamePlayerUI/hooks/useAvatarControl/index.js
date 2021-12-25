import { useReducer, useEffect } from "react";
import { default as APIContext } from "./context";
import { default as APIReducer } from "./reducers";

const useAvatarControl = ({
  avatarControlRef,
  // avatarControlState
}) => {
  // const _avatarControlState = avatarControlState;
  const _avatarControlRef = avatarControlRef;
  const [apiState, dispatch] = useReducer(APIReducer, {
    state: {},
    ref: _avatarControlRef,
  });
  // const { state: _state, ref: _dataRef } = apiState;
  const { ref: _dataRef } = apiState;

  // console.log("useAvatarControl reload", _avatarControlRef);

  const _updateDataRef = ({
    deltaX,
    deltaY,
    deltaZ,
    yaw,
    pitch,
    roll,
    timestamp,
  }) => {
    _dataRef.current = {
      deltaX,
      deltaY,
      deltaZ,
      yaw,
      pitch,
      roll,
      timestamp,
    };
  };

  const _updateOrientationDataRef = ({ yaw, pitch, roll, timestamp }) => {
    _dataRef.current = {
      ..._dataRef.current,
      yaw,
      pitch,
      roll,
      timestamp,
    };
  };

  const _updateMotionDataRef = ({ deltaX, deltaY, deltaZ, timestamp }) => {
    _dataRef.current = {
      ..._dataRef.current,
      deltaX,
      deltaY,
      deltaZ,
      timestamp,
    };
  };

  const _clearDataRef = () =>
    _updateDataRef({
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0,
      yaw: 0,
      pitch: 0,
      roll: 0,
      timestamp: Date.now(),
    });

  const _getDataRef = () => _dataRef.current;

  //  OnMount useEffect
  useEffect(() => {
    if (!_avatarControlRef || !_avatarControlRef.current)
      _avatarControlRef.current = {
        deltaX: 0,
        deltaY: 0,
        deltaZ: 0,
        yaw: 0,
        pitch: 0,
        roll: 0,
        timestamp: Date.now(),
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    avatarControlDispatcher: dispatch,
    avatarControlGetDataRef: _getDataRef,
    avatarControlClearDataRef: _clearDataRef,
    avatarControlUpdateDataRef: _updateDataRef,
    avatarControlUpdateMotionDataRef: _updateMotionDataRef,
    avatarControlUpdateOrientationDataRef: _updateOrientationDataRef,
    //  API Context
    AvatarControlContext: APIContext,
  };
};

export default useAvatarControl;
