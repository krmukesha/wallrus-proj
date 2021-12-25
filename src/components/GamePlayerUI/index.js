/* eslint-disable jsx-a11y/media-has-caption */
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import PropTypes from "prop-types";
import "./styles.css";

import VideoPlayerOverlay from "../VideoPlayerOverlay";

//  Resize functionality init
import * as resizeModes from "./constants/resizeModes";
import { useOnResizeListener, useInertialPositonTracking } from "../../hooks";
import { setResizeMode, resizePlayerStyle } from "./helpers";

//  Self state management declaration
import * as MODES from "./constants/modes";
// import * as IPT_MODES from "./hooks/useMainInteractionServerAPI/constants/ipt_modes";
// import * as CTL_MODES from "./hooks/useMainInteractionServerAPI/constants/ctl_modes";
import * as STATES from "./constants/states";
import * as ACTIONS from "./constants/actions";
import {
  useAvatarControl,
  useTouchScreenController,
  useMediaBrokerServiceAPI,
  useMainInteractionServerAPI,
} from "./hooks";
import { TouchScreenMonitor } from "./components";
import {
  controlActions,
  // subscribersActions,
} from "./hooks/useTouchScreenController/constants";
// import { TouchScreen } from "./components";

import {
  mapIMUOrientationToAvatarControlData,
  mapAvatarControlDataToMISFormat,
  mapTouchScreenForceToAvatarControlMotion,
} from "./helpers/apiAdapters";

const LOG_PREFIX = "[ DEBUG - GPUI ]";
const logInfo = (msg, dump) =>
  dump !== "NaN"
    ? console.info(`${LOG_PREFIX}`, msg, dump)
    : console.info(`${LOG_PREFIX}`, msg);

const logError = (msg, dump) =>
  dump !== "NaN"
    ? console.info(`${LOG_PREFIX}`, msg, dump)
    : console.info(`${LOG_PREFIX}`, msg);

const GamePlayerUI = ({
  sbsWSEndpoint,
  misWSEndpoint,
  debugLevel,
  autoplay,
  mode,
}) => {
  //
  //  Internal vars, refs and states
  //
  const [_mode] = useState(mode || MODES.CONTINUOUS);
  const [_autoplay] = useState(autoplay);
  const [_debugLevel] = useState(debugLevel);
  // const [_mbsState] = useState(STATES.MBS_PROMPT);
  const [_mbsState, set_mbsState] = useState(STATES.MBS_PROMPT);
  const [_mbsStateUpdated, set_mbsStateUpdated] = useState(false);
  const [_misState, set_misState] = useState(STATES.MIS_PROMPT);
  const [_misStateUpdated, set_misStateUpdated] = useState(true);
  const [_action, set_action] = useState();
  const [_actionUpdated, set_actionUpdated] = useState(false);
  // const [gpUIState, setUIState] = useState(STATES.GPUI_ST_PROMPT);
  const videoObjRef = useRef(null);
  const _mbsStateRef = useRef(STATES.MBS_PROMPT);
  const monitorConsoleRef = useRef();

  //  TODO : integrate this into MBS state, MIS state of self state
  const [_isVideoPlaying, set_videoPlay] = useState(false);

  //  TouchScreen
  const _touchScreenControlDataRef = useRef();
  const _touchScreenLayerRef = useRef();
  const coordXMonitorRef = useRef();
  const coordYMonitorRef = useRef();
  const nomForceXMonitorRef = useRef();
  const nomForceYMonitorRef = useRef();
  const netForceXMonitorRef = useRef();
  const netForceYMonitorRef = useRef();
  const [_displayMonitor] = useState(true);

  // logInfo("Reload");

  //  Avatar Control
  //  Reference needed to avoid reloading every time this changes.
  //  TODO : try finding an initial default state
  const _avatarControlRef = useRef({
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
    timestamp: Date.now(),
  });

  //  State set functions override
  const _updateMbsState = (state) => {
    set_mbsState(state);
    _mbsStateRef.current = state;
    set_mbsStateUpdated(true);
  };
  const _updateMisState = (state) => {
    set_misState(state);
    set_misStateUpdated(true);
  };
  const _updateAction = (action) => {
    set_action(action);
    set_actionUpdated(true);
  };

  //
  //  Hooks declaration
  //
  const { mbsSetCallbacks, mbsStartConnection } = useMediaBrokerServiceAPI({
    endpoint: sbsWSEndpoint,
    videoRef: videoObjRef,
    debugLevel: 1,
  });
  const {
    misSpawnPointID,
    misUnrealInstanceID,
    misSetCallbacks,
    misSendWSUpdate,
    misStartWSConnection,
  } = useMainInteractionServerAPI({
    endpoint: misWSEndpoint,
    debugLevel: 1,
    autoplay: false,
    spawnPointID: 3,
    unrealInstanceID: 10,
    // iptRefreshRate: 50, -> Works better with actual IPT thresholds
    iptRefreshRate: 20,
    // iptRefreshRate: IPT_MODES.PER_FRAME,
    // avatarControlInput: CTL_MODES.AVC_TOUCHSCREEN,
    // avatarControlDataRef: _touchScreenControlDataRef,
  });

  //
  //  TouchScreen Hook
  //
  const {
    //  Context / state / dispatcher
    touchScreenState, // Consider having this in parent component to avoid re-rendering: https://reactjs.org/docs/context.html#caveats
    TouchScreenContext,
    touchScreenDispatcher,
    //  Helper tools
    touchScreenSetCallbacks,
    touchScreenRegisterEvents,
    touchScreenInitControlDataRef,
  } = useTouchScreenController({
    controlRef: _touchScreenControlDataRef,
    displayMonitor: _displayMonitor, // To be deprecated. Component will be moved inside TouchScreen
    touchScreenLayerRef: _touchScreenLayerRef,
    // defaultMouseEventsMode: true,
    //  Touchscreen Monitor refs
    coordXMonitorRef,
    coordYMonitorRef,
    nomForceXMonitorRef,
    nomForceYMonitorRef,
    netForceXMonitorRef,
    netForceYMonitorRef,
    //  Callbacks
    // onTouchScreenTouchEnd: () => {},
    // onTouchScreenTouchMove: () => {},
    // onTouchScreenTouchStart: () => {},
  });

  //
  //  IMU Hook
  //
  // const { startTracking, get3DInertialContextData, imuSetCallbacks } =
  const {
    startTracking,
    get3DInertialContextData,
    imuSetCallbacks,
    // imuGetCallbacks,
  } = useInertialPositonTracking({
    isOrientationListenerOn: true,
    isMotionListenerOn: false,
    orientationRefMode: "absolute",
    orientationSource: "magnetometer",
    accelerationMode: "",
    computeQuaternions: true,
    isTrueNorthOn: true,
  });
  // console.log("useInertialPositonTracking", imuGetCallbacks());

  //  AvatarControl Hook
  const {
    avatarControlState,
    AvatarControlContext,
    avatarControlGetDataRef,
    avatarControlUpdateMotionDataRef,
    avatarControlUpdateOrientationDataRef,
  } = useAvatarControl({
    avatarControlRef: _avatarControlRef,
  });

  const onResizeHandler = () => {
    setResizeMode(resizeModes.FILL_WINDOW);
    resizePlayerStyle("#player");
    resizePlayerStyle("#TouchScreen-Joystick"); //  Change all joystick naming to just TouchScreen
  };
  useOnResizeListener({
    handler: onResizeHandler,
  });

  //  TouchScreen - Avatar Control Callbacks
  const _touchScreenOnPressed = useCallback(
    (data) => {
      // console.log(
      //   "_touchScreenOnPressed",
      //   data,
      //   _avatarControlRef,
      //   avatarControlGetDataRef(),
      // );
      avatarControlUpdateMotionDataRef(
        mapTouchScreenForceToAvatarControlMotion({
          touchScreenData:
            Array.isArray(data) && data.length > 0 ? data[0] : data,
          // ref: _avatarControlRef.current,
          ref: avatarControlGetDataRef(),
        }),
      );
      // console.log(
      //   "_touchScreenOnPressed",
      //   data,
      //   _avatarControlRef,
      //   avatarControlGetDataRef(),
      // );
      // _avatarControlRef.current = mapTouchScreenForceToAvatarControlMotion({
      //   touchScreenData: data,
      //   ref: _avatarControlRef.current,
      // });
    },
    [avatarControlGetDataRef, avatarControlUpdateMotionDataRef],
  );
  const _touchScreenOnReleased = (data) => {
    // console.log(
    //   "_touchScreenOnReleased",
    //   data,
    //   _avatarControlRef,
    //   avatarControlGetDataRef(),
    // );
    avatarControlUpdateMotionDataRef(
      mapTouchScreenForceToAvatarControlMotion({
        touchScreenData:
          Array.isArray(data) && data.length > 0 ? data[0] : data,
        ref: avatarControlGetDataRef(),
      }),
    );
  };
  const _touchScreenOnDragged = (data) => {
    // console.log(
    //   "_touchScreenOnDragged",
    //   data,
    //   _avatarControlRef,
    //   avatarControlGetDataRef(),
    // );
    avatarControlUpdateMotionDataRef(
      mapTouchScreenForceToAvatarControlMotion({
        touchScreenData:
          Array.isArray(data) && data.length > 0 ? data[0] : data,
        ref: avatarControlGetDataRef(),
      }),
    );
  };
  const _onIMUOrientationDataUpdate = useCallback(() => {
    // console.log("here");
    avatarControlUpdateOrientationDataRef(
      mapIMUOrientationToAvatarControlData({
        data: get3DInertialContextData().getOrientationQuat4Unreal({
          gainArray: [1, 1, 1],
        }),
        ref: avatarControlGetDataRef(),
      }),
    );
  }, [
    avatarControlGetDataRef,
    avatarControlUpdateOrientationDataRef,
    get3DInertialContextData,
  ]);

  // useEffect(() => {
  //   console.log({
  //     _mbsState,
  //     _mbsStateUpdated,
  //     _misState,
  //     _misStateUpdated,
  //     _action,
  //     _actionUpdated,
  //   });
  // });

  //
  //  Exposed triggers
  const initMBSConnection = useCallback(
    () => _updateAction(ACTIONS.INIT_MBS_CONNECTION),
    [],
  );
  const initMISConnection = useCallback(() => {
    if (_misState === STATES.MIS_READY) {
      _updateAction(ACTIONS.INIT_MIS_CONNECTION);
    } else {
      logError("MIS cannot initialize because it's not ready.");
    }
  }, [_misState]);

  //  Future implementations
  // const restartMBSConnection = useCallback(
  //   () => _updateAction(ACTIONS.RESTART_MBS_CONNECTION),
  //   [],
  // );
  // const restartMISConnection = useCallback(
  //   () => _updateAction(ACTIONS.RESTART_MIS_CONNECTION),
  //   [],
  // );
  // const requestSpawnInstance = useCallback(
  //   () => _updateAction(ACTIONS.REQUEST_SPAWN_INSTANCE),
  //   [],
  // );
  // const requestDespawnInstance = useCallback(
  //   () => _updateAction(ACTIONS.REQUEST_DESPAWN),
  //   [],
  // );
  // const killMBSConnection = useCallback(
  //   () => _updateAction(ACTIONS.KILL_MBS_CONNECTION),
  //   [],
  // );
  // const killMISConnection = useCallback(
  //   () => _updateAction(ACTIONS.KILL_MIS_CONNECTION),
  //   [],
  // );

  //
  //  OnMount useEffect
  //
  useEffect(() => {
    setResizeMode(resizeModes.FILL_WINDOW);
    resizePlayerStyle();

    //  MBS callbacks setup
    mbsSetCallbacks({
      onMBSReady: () => {
        _updateMbsState(STATES.MBS_READY);
      },
      onMBSConnectionSuccess: () => {
        _updateMbsState(STATES.MBS_INITIALIZING);
      },
      onMBSWebRTCInitSuccess: () => {
        // setUIState(uiStates.GPUI_ST_PAIRING);
        _updateMbsState(STATES.MBS_PAIRING);
      },
      onMBSWebRTCPairingSuccess: () => {
        // setUIState(uiStates.GPUI_ST_VIDEO_LOADING);
        _mbsStateRef.current !== STATES.MBS_LOADING_STREAM &&
          _mbsStateRef.current !== STATES.MBS_STREAM_LOADED &&
          _updateMbsState(STATES.MBS_LOADING_STREAM);
      },
      onMBSWebRTCVideoInitialized: () => {
        // setUIState(uiStates.GPUI_ST_VIDEO_READY);
        _updateMbsState(STATES.MBS_STREAM_LOADED); // or receiveing?
      },
    });

    //
    //  MIS callbacks setup
    let callbacks = {
      onMISSReady: () => {
        // logInfo("onMISSReady called");
        _updateMisState(STATES.MIS_READY);
      },
      onMISConnectionSuccessful: () => {
        _updateMisState(STATES.MIS_CONNECTED); // not streaming, that's IPT
      },
      onMISSpawning: () => {
        _updateMisState(STATES.MIS_REQUESTING_SPAWN);
      },
      onMISSpawnSuccessful: () => {
        //  TODO :: Start tracking in a more clean way.
        // console.log("StartTracking trig");
        // startTracking();
        _updateMisState(STATES.MIS_SPAWN_REQUEST_SUCCESSFUL);
      },
      onMISDespawning: () => {
        _updateMisState(STATES.MIS_DESPAWNING);
      },
      onMISDespawnSuccessful: () => {
        _updateMisState(STATES.MIS_TERMINATED);
      },
      // misSendSpawnSignal
      onMISSendSensorsUpdate: () => {
        //  Transform avatarControlDataRef into MIS format
        misSendWSUpdate(
          // `0 0 0 0 0 0 0`,
          mapAvatarControlDataToMISFormat(avatarControlGetDataRef()),
        );
        //  misSendSpawnSignal( mapAvatarControlDataToMISFormat )( _controlData.current );
      },
    };

    //  Only enable if in development environment
    // callbacks =
    //   process.env.NODE_ENV === "development"
    //     ? {
    //         ...callbacks,
    //         onMISSendSensorsUpdate: (data) => {
    //           monitorConsoleRef.current.value = `${data}\n${
    //             monitorConsoleRef.current.value || ""
    //           }`;
    //         },
    //       }
    //     : callbacks;

    misSetCallbacks(callbacks);

    //  TouchScreen init routines
    touchScreenInitControlDataRef();
    touchScreenDispatcher({
      type: controlActions.SET_GAIN,
      payload: {
        h: 10,
        v: 10,
      },
    });
    // touchScreenDispatcher({
    //   type: subscribersActions.ADD_ON_PRESSED,
    //   payload: _touchScreenOnPressed,
    // });
    // touchScreenDispatcher({
    //   type: subscribersActions.ADD_ON_RELEASED,
    //   payload: _touchScreenOnReleased,
    // });
    // touchScreenDispatcher({
    //   type: subscribersActions.ADD_ON_DRAGGED,
    //   payload: _touchScreenOnDragged,
    // });
    touchScreenSetCallbacks({
      onTouchScreenTouchEnd: _touchScreenOnReleased,
      onTouchScreenTouchMove: _touchScreenOnDragged,
      onTouchScreenTouchStart: _touchScreenOnPressed,
    });

    //  IMU callbacks setup
    imuSetCallbacks({
      onIMUUpdateOrientationData: _onIMUOrientationDataUpdate,
    });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  Could also work with videoObjRef
  useLayoutEffect(() => {
    _isVideoPlaying &&
      _touchScreenLayerRef &&
      _touchScreenLayerRef.current &&
      touchScreenRegisterEvents();
    onResizeHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_isVideoPlaying]);

  useLayoutEffect(() => {
    onResizeHandler();
  }, []);

  //
  //  MBS state useEffect reducer
  useEffect(() => {
    if (!_mbsStateUpdated) return;
    switch (_mbsState) {
      case STATES.MBS_READY:
        _debugLevel > 0 && logInfo("MBS module ready.");
        _autoplay && initMBSConnection();
        set_mbsStateUpdated(false);
        break;
      case STATES.MBS_INITIALIZING:
        _debugLevel > 0 && logInfo("Initializing MBS module.");
        set_mbsStateUpdated(false);
        break;
      case STATES.MBS_PAIRING:
        _debugLevel > 0 && logInfo("Pairing with game instance.");
        set_mbsStateUpdated(false);
        break;
      case STATES.MBS_LOADING_STREAM:
        _debugLevel > 0 && logInfo("Loading video stream.");
        set_mbsStateUpdated(false);
        break;
      case STATES.MBS_STREAM_LOADED:
        _debugLevel > 0 && logInfo("Stream loaded and ready.");
        set_mbsStateUpdated(false);
        _mode === MODES.CONTINUOUS && initMISConnection();
        break;

      default:
        break;
    }
  }, [
    _mbsState,
    _mbsStateUpdated,
    _debugLevel,
    _autoplay,
    _mode,
    initMBSConnection,
    initMISConnection,
  ]);

  //
  //  MIS state useEffect reducer
  useEffect(() => {
    if (!_misStateUpdated) return;
    switch (_misState) {
      case STATES.MIS_READY:
        _debugLevel > 0 && logInfo("MIS module ready.");
        set_misStateUpdated(false);
        break;
      case STATES.MIS_CONNECTED:
        _debugLevel > 0 && logInfo("Connected to MIS.");
        set_misStateUpdated(false);
        break;
      case STATES.MIS_REQUESTING_SPAWN:
        _debugLevel > 0 &&
          logInfo(
            `Requesting spawn instance using spawn point ID ${misSpawnPointID} and unreal instance ID ${misUnrealInstanceID}`,
          );
        set_misStateUpdated(false);
        break;
      case STATES.MIS_SPAWN_REQUEST_SUCCESSFUL:
        _debugLevel > 0 && logInfo("Spawn request successful.");
        startTracking();
        set_misStateUpdated(false);
        break;
      case STATES.MIS_DESPAWNING:
        _debugLevel > 0 && logInfo("Despawning routine started.");
        set_misStateUpdated(false);
        break;
      case STATES.MIS_TERMINATED:
        _debugLevel > 0 && logInfo("MIS communication terminated.");
        set_misStateUpdated(false);
        break;

      default:
        break;
    }
  }, [
    _debugLevel,
    _misState,
    _misStateUpdated,
    _mode,
    misSpawnPointID,
    misUnrealInstanceID,
    startTracking,
  ]);

  //
  //  private action callbacks
  const _initMBSConnection = useCallback(() => {
    if (_mbsState === STATES.MBS_READY) {
      mbsStartConnection();
    } else {
      logError(
        "MIS Connection cannot be established because MIS is not Ready.",
      );
    }
  }, [_mbsState, mbsStartConnection]);
  const _initMISConnection = useCallback(
    () => misStartWSConnection(),
    [misStartWSConnection],
  );
  // const _requestSpawnInstance = useCallback(
  //   () => misSendSpawnSignal(),
  //   [misSendSpawnSignal],
  // );

  //
  //  action useEffect reducer
  useEffect(() => {
    if (!_actionUpdated) return;
    switch (_action) {
      case ACTIONS.INIT_MBS_CONNECTION:
        _initMBSConnection();
        break;
      case ACTIONS.INIT_MIS_CONNECTION:
        _initMISConnection();
        break;
      case ACTIONS.RESTART_MBS_CONNECTION:
        break;
      case ACTIONS.RESTART_MIS_CONNECTION:
        break;
      case ACTIONS.KILL_MBS_CONNECTION:
        break;
      case ACTIONS.KILL_MIS_CONNECTION:
        break;
      case ACTIONS.REQUEST_SPAWN_INSTANCE:
        // _requestSpawnInstance();
        break;
      case ACTIONS.REQUEST_DESPAWN:
        break;

      default:
        break;
    }
    set_actionUpdated(false);
  }, [_action, _actionUpdated, _initMBSConnection, _initMISConnection]);

  // console.log("GamePlayerUI reload");

  const handleOnVideoInitialized = () => {
    // console.log(videoObjRef.current);
    videoObjRef.current.play();
    set_videoPlay(true);
  };

  return (
    <TouchScreenContext.Provider
      value={{ state: touchScreenState, dispatch: touchScreenDispatcher }}
    >
      <AvatarControlContext.Provider
        value={{ state: avatarControlState, controlRef: _avatarControlRef }}
      >
        <div id="playerUI">
          <div className="row-container">
            <div id="player">
              <VideoPlayerOverlay
                mbsState={_mbsState}
                // misState={_misState}
                // gpUIState={gpUIState}
                HUDDisplay={true}
                onClickStart={handleOnVideoInitialized}
                monitorConsoleRef={monitorConsoleRef}
              />
              <video
                id={"streamingVideo"}
                ref={videoObjRef}
                playsInline={true}
                autoPlay={true}
              />
            </div>
          </div>

          {/* Enable TouchScreenJoystick if video has started and user has tapped on start */}

          <div className="row-container">
            {/* <TouchScreen
            displayMonitor={true}
            touchScreenLayerRef={_touchScreenLayerRef}
          /> */}
            {_isVideoPlaying && (
              <div id="TouchScreen-Joystick">
                <div id="TCJS-Control-Layer" ref={_touchScreenLayerRef}></div>
                {_displayMonitor && (
                  <TouchScreenMonitor
                    refs={{
                      coordXRef: coordXMonitorRef,
                      coordYRef: coordYMonitorRef,
                      nomForceXRef: nomForceXMonitorRef,
                      nomForceYRef: nomForceYMonitorRef,
                      netForceXRef: netForceXMonitorRef,
                      netForceYRef: netForceYMonitorRef,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </AvatarControlContext.Provider>
    </TouchScreenContext.Provider>
  );
  //
};
GamePlayerUI.propTypes = {
  mode: PropTypes.bool,
  autoplay: PropTypes.bool,
  debugLevel: PropTypes.number,
  sbsWSEndpoint: PropTypes.string,
  misWSEndpoint: PropTypes.string,
};

export default GamePlayerUI;
