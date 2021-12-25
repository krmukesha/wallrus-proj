import { useState, useEffect, useCallback, useRef } from "react";

import {
  useWebSocketClient,
  // useInertialPositonTracking,
} from "../../../../hooks";

import * as STATES from "./constants/states";
import * as MODES from "./constants/modes";
import * as ACTIONS from "./constants/actions";
import * as IPT_MODES from "./constants/ipt_modes";
// import * as CTL_MODES from "./constants/ctl_modes";

const LOG_PREFIX = "[ DEBUG - MIS ]";

const logInfo = (msg, dump) =>
  dump !== "NaN"
    ? console.info(`${LOG_PREFIX}`, msg, dump)
    : console.info(`${LOG_PREFIX}`, msg);

const logWarn = (msg, dump) =>
  dump !== "NaN"
    ? console.warn(`${LOG_PREFIX}`, msg, dump)
    : console.warn(`${LOG_PREFIX}`, msg);

const logError = (msg, dump) =>
  dump !== "NaN"
    ? console.error(`${LOG_PREFIX}`, msg, dump)
    : console.error(`${LOG_PREFIX}`, msg);

const useMainInteractionServerAPI = ({
  //  Initial state config
  mode,
  autoplay = false,
  endpoint,
  debugLevel = 0,
  iptRefreshRate,
  spawnPointID = 0,
  unrealInstanceID = 0,
  // avatarControlInput,
  // avatarControlDataRef,
  //  Hook state callbacks
  onMISReady,
  onMISConnecting,
  onMISConnectionSuccessful,
  onMISConnectionFailed,
  onMISDisconnected,
  onMISSpawning,
  onMISSpawnSuccessful,
  onMISSpawnFailed,
  onMISDespawning,
  onMISDespawnSuccessful,
  onMISDespawnFailed,
  onMISSendSensorsUpdate = () => {},
}) => {
  let _renderIteration = useRef(0);
  let _onWSReadyCallNumber = useRef(0);
  const [_mode, set_mode] = useState(mode || MODES.CONTINUOUS);
  const [_autoplay, set_autoplay] = useState(autoplay);
  const [_debugLevel, set_debugLevel] = useState(debugLevel);
  const [_state, set_state] = useState(STATES.PROMPT);
  let _stateRef = useRef(STATES.PROMPT);
  const [_stateUpdated, set_stateUpdated] = useState(false);
  const [_action, set_action] = useState();
  const [_actionUpdated, set_actionUpdated] = useState(false);
  const [_callbacks, set_callbacks] = useState({
    onMISReady,
    onMISConnecting,
    onMISConnectionSuccessful,
    onMISConnectionFailed,
    onMISDisconnected,
    onMISSpawning,
    onMISSpawnSuccessful,
    onMISSpawnFailed,
    onMISDespawning,
    onMISDespawnSuccessful,
    onMISDespawnFailed,
    onMISSendSensorsUpdate,
  });
  const [_unrealInstanceID, set_unrealInstanceID] = useState(unrealInstanceID); // Unreal game instance
  const [_spawnPointID, set_spawnPointID] = useState(spawnPointID); // Unreal game instance
  const [_iptRefreshRate, set_iptRefreshRate] = useState(
    iptRefreshRate || IPT_MODES.PER_FRAME,
  );
  // PPB updates Stub
  const _updatesIntervalRef = useRef(); // Replace with _iptRefreshRate
  //  TouchScreen Control
  // const [_avatarControlInput, set_avatarControlInput] = useState(
  //   avatarControlInput ?? CTL_MODES.AVC_IPT,
  // );
  // console.log("MIS_TSJ - ", avatarControlInput, avatarControlDataRef);
  // const _avatarControlDataRef = useRef(avatarControlDataRef.current);
  // const _avatarControlDataRef = avatarControlDataRef;
  // console.log("MIS_TSJ - ", _avatarControlInput, _avatarControlDataRef);

  //  State set functions override
  const _updateState = (state) => {
    set_state(state);
    _stateRef.current = state;
    set_stateUpdated(true);
  };
  const _updateAction = (action) => {
    set_action(action);
    set_actionUpdated(true);
  };

  //  External hooks and APIs declaration
  const { wsInitConnection, wsCloseConnection, wsSetCallbacks, wsSend } =
    useWebSocketClient({
      endpoint: endpoint,
      debugLevel: 1,
    });
  // const { startTracking, stopTracking } = useInertialPositonTracking({
  // const { stopTracking } = useInertialPositonTracking({
  //   orientationSource: "magnetometer",
  //   accelerationMode: "",
  //   computeQuaternions: true,
  // });

  // logInfo("Reload");

  // useEffect(() => {
  //   console.log({
  //     _renderIteration,
  //     _state,
  //     _stateUpdated,
  //     _action,
  //     _actionUpdated,
  //   });
  // });

  //  Exposed triggers
  const initWSConnection = useCallback(() => {
    _updateAction(ACTIONS.INIT_WS_CONNECTION);
  }, []);
  const startWSConnection = useCallback(() => {
    _updateAction(ACTIONS.START_WS_CONNECTION);
  }, []);
  const initSpawnSignal = useCallback(() => {
    _updateAction(ACTIONS.INIT_SPAWN_SIGNAL);
  }, []);
  const shiftSpawnSuccess = useCallback(() => {
    _updateAction(ACTIONS.SHIFT_SPAWN_SUCCESS);
  }, []);
  const shiftSpawnFailed = useCallback(() => {
    _updateAction(ACTIONS.SHIFT_SPAWN_FAILED);
  }, []);
  const sendSpawnSignal = useCallback(() => {
    _updateAction(ACTIONS.SEND_SPAWN_SIGNAL);
  }, []);
  const initDespawnRoutine = () => {
    _updateAction(ACTIONS.INIT_DESPAWN_ROUTINE);
  };
  const startDespawnRoutine = () => {
    _updateAction(ACTIONS.START_DESPAWN_ROUTINE);
  };
  const promptIPT = useCallback(() => {
    _updateAction(ACTIONS.PROMPT_IPT);
  }, []);
  const initIPT = useCallback(() => {
    _updateAction(ACTIONS.INIT_IPT);
  }, []);
  const initIPTTracking = () => {
    _updateAction(ACTIONS.INIT_IPT_TRACKING);
  };
  const startIPTTracking = () => {
    _updateAction(ACTIONS.START_IPT_TRACKING);
  };
  const initIPTStreaming = () => {
    _updateAction(ACTIONS.INIT_IPT_STREAM);
  };
  const startIPTStreaming = () => {
    _updateAction(ACTIONS.START_IPT_STREAM);
  };
  const initIPTHalt = () => {
    _updateAction(ACTIONS.HALT_IPT_STREAM);
  };
  const haltIPTStreaming = () => {
    _updateAction(ACTIONS.HALT_IPT_STREAM);
  };

  //
  //  OnMount useEffect
  //
  useEffect(() => {
    wsSetCallbacks({
      onWSReady: () => {
        _onWSReadyCallNumber.current++;
        if (_state !== STATES.READY) _updateState(STATES.READY);
      }, // Combine this callback with the component onReady state
      onWSConnectionSuccessful: () => {
        _updateState(STATES.CONNECTION_SUCCESSFUL);
      },
      onWSConnectionFailed: () => {
        _updateState(STATES.CONNECTION_FAILED);
      },
      onWSMessage: (msg) => {
        logInfo("WS message: ", msg);
        if (msg !== "spawn-failed") {
          logInfo("spawn success", _callbacks.onMISSpawnSuccessful);
          // _callbacks.onMISSpawnSuccessful?.(msg);
        }
        switch (msg) {
          case "spawn-success":
            shiftSpawnSuccess();
            break;
          case "spawn-failed":
            shiftSpawnFailed();
            break;
          // Add other cases related to ACK
          default:
            break;
        }
      },
      // To revise these 2 cases, there seems to be a
      // racing condition with these
      onWSClose: () => {
        switch (_state) {
          case STATES.DESPAWNING_GAME_INSTANCE:
            _updateState(STATES.DESPAWN_SUCCESSFUL);
            break;
          case STATES.CONNECTION_SUCCESSFUL:
            _updateState(STATES.DISCONNECTED);
            break;
          default:
            break;
        }
      },
      onWSDisconnected: () => {
        switch (_stateRef.current) {
          case STATES.DESPAWNING_GAME_INSTANCE:
            _updateState(STATES.DESPAWN_SUCCESSFUL);
            break;
          case STATES.CONNECTION_SUCCESSFUL:
            _updateState(STATES.DISCONNECTED);
            break;
          default:
            break;
        }
      },
    });
    return () => {
      wsCloseConnection();
      clearInterval(_updatesIntervalRef.current);
      _updatesIntervalRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  //  State useEffect reducer
  useEffect(() => {
    if (!_stateUpdated) return;
    switch (_state) {
      case STATES.PROMPT:
        _debugLevel > 0 && logInfo("API idle");
        set_stateUpdated(false);
        break;
      case STATES.READY:
        _debugLevel > 0 && logInfo("API ready", _stateUpdated);
        _autoplay && initWSConnection();
        _callbacks.onMISSReady && _callbacks.onMISSReady();
        set_stateUpdated(false);
        break;
      case STATES.CONNECTING:
        _debugLevel > 0 && logInfo("Connecting to MIS endpoint");
        startWSConnection();
        _callbacks.onMISConnecting && _callbacks.onMISConnecting();
        set_stateUpdated(false);
        break;
      case STATES.CONNECTION_SUCCESSFUL:
        _debugLevel > 0 && logInfo("Connection successful.");
        _mode === MODES.CONTINUOUS && initSpawnSignal();
        _callbacks.onMISConnectionSuccessful &&
          _callbacks.onMISConnectionSuccessful();
        set_stateUpdated(false);
        break;
      case STATES.CONNECTION_FAILED:
        _debugLevel > 0 &&
          logInfo("Connection failed. Check the WS error log.");
        set_stateUpdated(false);
        _callbacks.onMISConnectionFailed && _callbacks.onMISConnectionFailed();
        break;
      case STATES.DISCONNECTED:
        _debugLevel > 0 && logInfo("WS connection was dropped.");
        set_stateUpdated(false);
        _callbacks.onMISDisconnected && _callbacks.onMISDisconnected();
        break;
      case STATES.SPAWNING_GAME_INSTANCE:
        _debugLevel > 0 && logInfo("Spawn request sent.");
        sendSpawnSignal();
        set_stateUpdated(false);
        _callbacks.onMISSpawning && _callbacks.onMISSpawning();
        break;
      case STATES.SPAWN_SUCCESSFUL:
        _debugLevel > 0 && logInfo("Spawn request was accepted.");
        set_stateUpdated(false);
        _mode === MODES.CONTINUOUS && promptIPT();
        // _callbacks.onMISSpawnSuccessful && _callbacks.onMISSpawnSuccessful();
        _callbacks.onMISSpawnSuccessful?.();
        break;
      case STATES.SPAWN_FAILED:
        _debugLevel > 0 && logWarn("Spawn request failed.");
        set_stateUpdated(false);
        _callbacks.onMISSpawnFailed?.();
        break;
      case STATES.DESPAWNING_GAME_INSTANCE:
        _debugLevel > 0 && logInfo("Despawning routine initiated.");
        startDespawnRoutine();
        set_stateUpdated(false);
        _callbacks.onMISDespawning && _callbacks.onMISDespawning();
        break;
      case STATES.DESPAWN_SUCCESSFUL:
        _debugLevel > 0 && logInfo("Despawning successful.");
        set_stateUpdated(false);
        _callbacks.onMISDespawnSuccessful &&
          _callbacks.onMISDespawnSuccessful();
        break;
      case STATES.DESPAWN_FAILED:
        _debugLevel > 0 && logWarn("Despawning failed.");
        set_stateUpdated(false);
        _callbacks.onMISDespawnFailed && _callbacks.onMISDespawnFailed();
        break;
      case STATES.IPT_PROMPT:
        _debugLevel > 0 && logInfo("IPT Prompt.");
        _mode === MODES.CONTINUOUS && initIPT();
        set_stateUpdated(false);
        _callbacks.onMISIPTPrompt && _callbacks.onMISIPTPrompt();
        break;
      case STATES.IPT_READY:
        _debugLevel > 0 && logInfo("IPT Ready.");
        _mode === MODES.CONTINUOUS && initIPTTracking();
        set_stateUpdated(false);
        _callbacks.onMISIPTReady && _callbacks.onMISIPTReady();
        break;
      case STATES.IPT_INIT_TRACKING:
        _debugLevel > 0 && logInfo("Initiating tracking.");
        startIPTTracking();
        set_stateUpdated(false);
        _callbacks.onMISIPTInitTracking && _callbacks.onMISIPTInitTracking();
        break;
      case STATES.IPT_TRACKING:
        _debugLevel > 0 && logInfo("Tracking.");
        _mode === MODES.CONTINUOUS && initIPTStreaming();
        set_stateUpdated(false);
        _callbacks.onMISIPTTracking && _callbacks.onMISIPTTracking();
        break;
      case STATES.IPT_STREAMING_DATA:
        _debugLevel > 0 && logInfo("IPT Streaming Data.");
        startIPTStreaming();
        set_stateUpdated(false);
        _callbacks.onMISIPTStreamingData && _callbacks.onMISIPTStreamingData();
        break;
      case STATES.IPT_INIT_HALTING:
        _debugLevel > 0 && logInfo("IPT Halting.");
        initIPTHalt();
        set_stateUpdated(false);
        _callbacks.onMISIPTHalted && _callbacks.onMISIPTHalted();
        break;
      case STATES.IPT_HALTED:
        _debugLevel > 0 && logInfo("IPT Halted.");
        haltIPTStreaming();
        set_stateUpdated(false);
        _callbacks.onMISIPTHalted && _callbacks.onMISIPTHalted();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    _state, // Main dependency
    _stateUpdated,
    // _autoplay,
    // _callbacks,
    // _debugLevel,
    // _mode,
    // sendSpawnSignal,
    // startWSConnection,
  ]);

  //
  //  private action callbacks
  const _initWSConnection = useCallback(() => {
    _updateState(STATES.CONNECTING);
  }, []);

  const _startWSConnection = useCallback(() => {
    // Declare onMessage override to receive spawn ACK and despawn signal
    // on WebSocket
    wsInitConnection();
  }, [wsInitConnection]);

  const _initSpawnSignal = useCallback(() => {
    _updateState(STATES.SPAWNING_GAME_INSTANCE);
  }, []);

  //  TODO : replace this with actual ACK received from MIS
  const _sendSpawnSignal = useCallback(() => {
    wsSend(`spawn ${_unrealInstanceID}`);
    // _mode === MODES.CONTINUOUS && _updateState(STATES.IPT_PROMPT);
  }, [_unrealInstanceID, wsSend]);

  const _shiftSpawnSuccess = useCallback(() => {
    _updateState(STATES.SPAWN_SUCCESSFUL);
  }, []);

  const _shiftSpawnFailed = useCallback(() => {
    _updateState(STATES.SPAWN_FAILED);
  }, []);

  //  Exposed calls
  //  TODO :: Verify that the message conforms to MIS expected data format
  const _sendWSUpdate = (data) => wsSend(data);

  const _initDespawnRoutine = useCallback(() => {
    _updateState(STATES.DESPAWNING_GAME_INSTANCE);
  }, []);

  const _startDespawnRoutine = useCallback(() => {
    wsCloseConnection();
  }, [wsCloseConnection]);

  //
  // PPB updates Stub
  const _sendUpdates = useCallback(() => {
    // logInfo(
    //   "Step 1 - Rotation update",
    //   get3DInertialContextData().getCurrentRotation(),
    // );

    _callbacks.onMISSendSensorsUpdate && _callbacks.onMISSendSensorsUpdate();

    // //  Replacing starts
    // refreshITP();
    // _callbacks.onMISSendSensorsUpdate &&
    //   _callbacks.onMISSendSensorsUpdate(
    //     get3DInertialContextData().getFullDataDump(true),
    //   );

    // // console.log(_avatarControlDataRef.current);

    // //  Calculate shift
    // //  Failsafe for when _avatarControlDataRef is not defined.
    // const shift =
    //   _avatarControlInput === CTL_MODES.AVC_TOUCHSCREEN
    //     ? _avatarControlDataRef && _avatarControlDataRef.current
    //       ? `${
    //           (_avatarControlDataRef.current.netForce_x &&
    //             _avatarControlDataRef.current.netForce_x.toFixed(2)) ||
    //           `0`
    //         } ${
    //           (_avatarControlDataRef.current.netForce_y &&
    //             _avatarControlDataRef.current.netForce_y.toFixed(2)) ||
    //           `0`
    //         } 0`
    //       : `0 0 0`
    //     : `${Object.entries(
    //         get3DInertialContextData().getDeltasPosition4Unreal({
    //           // gainArray: [1, 1, 350],
    //           gainArray: [0, 0, 0],
    //           reverseArray: [1, 1, -1],
    //         }),
    //       )
    //         .map((e) => e[1])
    //         .reduce((p, c) => `${p ? `${p} ` : ``}${c}`, "")}`;

    // //  Calculate rotation
    // const rotation = `${Object.entries(
    //   get3DInertialContextData().getOrientationQuat4Unreal({
    //     gainArray: [1, 1, 0],
    //   }),
    // )
    //   .map((e) => e[1])
    //   .reduce((p, c) => `${p} ${c}`, "")}`;

    // //  MIS-based data update
    // wsSend(`${shift}${rotation} ${Date.now()}`);
    // //  Replacing ends
  }, [_callbacks]);

  const _sendUpdatesPerFrame = useCallback(() => {
    _sendUpdates();
    requestAnimationFrame(_sendUpdatesPerFrame);
  }, [_sendUpdates]);

  const _startUpdatesPerFrame = useCallback(() => {
    _updatesIntervalRef.current = requestAnimationFrame(() => {
      _sendUpdatesPerFrame();
    });
  }, [_sendUpdatesPerFrame]);

  const _startUpdatesPerInterval = useCallback(() => {
    _updatesIntervalRef.current = setInterval(
      _sendUpdates,
      parseInt(_iptRefreshRate, 10),
    );
  }, [_iptRefreshRate, _sendUpdates]);

  const _startUpdates = useCallback(() => {
    if (_iptRefreshRate === IPT_MODES.PER_FRAME) {
      logInfo("IPT refresh rate set to PER_FRAME");
      _startUpdatesPerFrame();
    } else if (Number.isInteger(_iptRefreshRate)) {
      logInfo("IPT refresh rate set to INTERVAL: ", _iptRefreshRate);
      _startUpdatesPerInterval();
    } else {
      logError(
        "IPT refresh rate should either be a number or the flag IPT_MODE_PER_FRAME.",
        Number.isInteger(_iptRefreshRate, 10),
      );
    }
  }, [_iptRefreshRate, _startUpdatesPerFrame, _startUpdatesPerInterval]);

  const _promptIPT = useCallback(() => {
    _updateState(STATES.IPT_PROMPT);
  }, []);
  const _initIPT = useCallback(() => {
    _updateState(STATES.IPT_READY);
  }, []);
  const _initIPTTracking = useCallback(() => {
    _updateState(STATES.IPT_INIT_TRACKING);
  }, []);
  const _startIPTTracking = useCallback(() => {
    // startTracking();
    _updateState(STATES.IPT_TRACKING);
  }, []);
  // }, [startTracking]);
  const _initIPTStreaming = useCallback(() => {
    _updateState(STATES.IPT_STREAMING_DATA);
  }, []);
  const _initIPTHalt = useCallback(() => {
    _updateState(STATES.IPT_INIT_HALTING);
  }, []);
  const _haltIPTStream = useCallback(() => {
    _stoptUpdatesPerFrame();
    // stopTracking();
  }, []);

  const _stoptUpdatesPerFrame = () =>
    cancelAnimationFrame(_updatesIntervalRef.current);

  //
  //  Actions useEffect reducer
  useEffect(() => {
    if (!_actionUpdated) return;
    switch (_action) {
      case ACTIONS.INIT_WS_CONNECTION:
        _initWSConnection();
        break;
      case ACTIONS.START_WS_CONNECTION:
        _startWSConnection();
        break;
      case ACTIONS.INIT_SPAWN_SIGNAL:
        _initSpawnSignal();
        break;
      case ACTIONS.SEND_SPAWN_SIGNAL:
        _sendSpawnSignal();
        break;
      case ACTIONS.SHIFT_SPAWN_SUCCESS:
        _shiftSpawnSuccess();
        break;
      case ACTIONS.SHIFT_SPAWN_FAILED:
        _shiftSpawnFailed();
        break;
      case ACTIONS.INIT_DESPAWN_ROUTINE:
        _initDespawnRoutine();
        break;
      case ACTIONS.START_DESPAWN_ROUTINE:
        _startDespawnRoutine();
        break;
      case ACTIONS.PROMPT_IPT:
        _promptIPT();
        break;
      case ACTIONS.INIT_IPT:
        _initIPT();
        break;
      case ACTIONS.INIT_IPT_TRACKING:
        _initIPTTracking();
        break;
      case ACTIONS.START_IPT_TRACKING:
        _startIPTTracking();
        break;
      case ACTIONS.INIT_IPT_STREAM:
        _initIPTStreaming();
        break;
      case ACTIONS.START_IPT_STREAM:
        _startUpdates();
        break;
      case ACTIONS.INIT_IPT_HALT:
        _initIPTHalt();
        break;
      case ACTIONS.HALT_IPT_STREAM:
        _haltIPTStream();
        break;

      default:
        break;
    }
    set_actionUpdated(false);
  }, [
    _action,
    _actionUpdated,
    _haltIPTStream,
    _initDespawnRoutine,
    _initIPT,
    _initIPTHalt,
    _initIPTStreaming,
    _initIPTTracking,
    _initSpawnSignal,
    _shiftSpawnSuccess,
    _shiftSpawnFailed,
    _initWSConnection,
    _promptIPT,
    _sendSpawnSignal,
    _startDespawnRoutine,
    _startIPTTracking,
    _startUpdates,
    _startUpdatesPerFrame,
    _startWSConnection,
  ]);
  _renderIteration.current++;

  return {
    //  Exposed state vars and refs
    misSpawnPointID: _spawnPointID,
    misUnrealInstanceID: _unrealInstanceID,
    //  Params setters
    misSetMode: set_mode,
    misSetAutoplay: set_autoplay,
    misSetCallbacks: set_callbacks,
    misSetDebugLevel: set_debugLevel,
    misSetIPTRefreshRate: set_iptRefreshRate,
    misSetSpawnPointID: set_spawnPointID,
    misSetUnrealInstanceID: set_unrealInstanceID,
    // misSetAvatarControlInput: set_avatarControlInput,
    //  Triggers / functions
    misSendWSUpdate: _sendWSUpdate,
    misSendSpawnSignal: sendSpawnSignal,
    misStartWSConnection: startWSConnection,
    misinitDespawnRoutine: initDespawnRoutine,
  };
};
export default useMainInteractionServerAPI;
