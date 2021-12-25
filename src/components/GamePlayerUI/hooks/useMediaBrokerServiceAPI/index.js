import { useEffect, useState } from "react";

import { useWebRtcClient } from "../../../../hooks";

import * as SS_STATES from "../../../../hooks/useWebRtcClient/constants/SignalingServerStates";
import * as WR_STATES from "../../../../hooks/useWebRtcClient/constants/WebRtcClientStates";
// import * as DC_STATES from "../../hooks/useWebRTCClient/constants/DataChannelStates";

import * as MODES from "./constants/modes";
import * as STATES from "./constants/states";
import * as ACTIONS from "./constants/actions";

const LOG_PREFIX = "[ DEBUG - MBS ]";

const logInfo = (msg, dump) =>
  dump !== "NaN"
    ? console.info(`${LOG_PREFIX}`, msg, dump)
    : console.info(`${LOG_PREFIX}`, msg);

// const logWarn = (msg, dump) =>
//   dump !== "NaN"
//     ? console.error(`${LOG_PREFIX}`, msg, dump)
//     : console.error(`${LOG_PREFIX}`, msg);

const useMediaBrokerServiceAPI = ({
  //  Initial state config
  endpoint,
  videoRef,
  autostart,
  debugLevel,
  //  Hook state callbacks
  onMBSReady,
  onMBSConnectionSuccess,
  onMBSWebRTCInitSuccess,
  onMBSCreateWebRTCOfferSuccess,
  onMBSWebRTCICEExchangeSuccess,
  onMBSWebRTCPairingSuccess,
  onMBSVideoInitialized,
}) => {
  const [_debugLevel, set_debugLevel] = useState(debugLevel || 0);
  const [_state, setState] = useState(STATES.MBS_ST_PROMPT);
  const [_stateUpdated, set_stateUpdated] = useState(true);
  const [_autostart, setAutostart] = useState(autostart || false);
  const [_mode, setMode] = useState(MODES.MBS_MODE_CONTINUOUS);
  const [_action, setAction] = useState();
  const [_actionUpdated, set_actionUpdated] = useState(false);
  const [_callbacks, setCallbacks] = useState({
    onMBSReady,
    onMBSConnectionSuccess,
    onMBSWebRTCInitSuccess,
    onMBSCreateWebRTCOfferSuccess,
    onMBSWebRTCICEExchangeSuccess,
    onMBSWebRTCPairingSuccess,
    onMBSVideoInitialized,
  });

  //  <*>
  //  Module Loading
  const {
    wrtcClientState,
    wsClientState,
    videoElementRef,
    startSignalingServerConnection,
    startWebRTCPairing,
    createWebRTCOffer,
  } = useWebRtcClient({
    ssEndpoint: `${endpoint}`,
    setForceUpdate: null,
  });

  //
  //  Onmount useEffect
  useEffect(() => {
    videoElementRef.current = videoRef.current;
    // setState(STATES.MBS_ST_READY);
    _updateState(STATES.MBS_ST_READY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  //  State useEffect reducer
  useEffect(() => {
    if (!_stateUpdated) return;
    // set_stateUpdated(false); // Will be applied at the end of the render loop

    switch (_state) {
      case STATES.MBS_ST_PROMPT:
        _debugLevel > 0 && logInfo("API idle.");
        // set_stateUpdated(false);
        break;
      case STATES.MBS_ST_READY:
        _debugLevel > 0 && logInfo("API ready.");
        _mode === MODES.MBS_MODE_CONTINUOUS &&
          _autostart &&
          startSignalingServerConnection();
        set_stateUpdated(false);
        _callbacks.onMBSReady && _callbacks.onMBSReady();
        break;
      case STATES.MBS_ST_SS_CONNECTION_SUCCESSFUL:
        _debugLevel > 0 &&
          logInfo("Successfully connected to signaling server.");
        _callbacks.onMBSConnectionSuccess &&
          _callbacks.onMBSConnectionSuccess();
        _mode === MODES.MBS_MODE_CONTINUOUS && startWebRTCPairing();
        set_stateUpdated(false);
        break;
      case STATES.MBS_ST_WRTC_INIT_SUCCESSFUL:
        _debugLevel > 0 && logInfo("WebRTC client initialized.");
        _callbacks.onMBSWebRTCInitSuccess &&
          _callbacks.onMBSWebRTCInitSuccess();
        _mode === MODES.MBS_MODE_CONTINUOUS && createWebRTCOffer();
        set_stateUpdated(false);
        break;
      case STATES.MBS_ST_WRTC_PAIRING_SUCCESSFUL:
        _debugLevel > 0 && logInfo("WebRTC pairing successful.");
        _callbacks.onMBSWebRTCPairingSuccess &&
          _callbacks.onMBSWebRTCPairingSuccess();
        set_stateUpdated(false);
        break;
      case STATES.MBS_ST_WRTC_VIDEO_INITIALIZED:
        _debugLevel > 0 && logInfo("WebRTC video initialized.");
        _callbacks.onMBSWebRTCVideoInitialized &&
          _callbacks.onMBSWebRTCVideoInitialized();
        set_stateUpdated(false);
        break;
      default:
        // set_stateUpdated(false);
        break;
    }
    // set_stateUpdated(false);
  }, [
    _state,
    _mode,
    _autostart,
    createWebRTCOffer,
    startSignalingServerConnection,
    startWebRTCPairing,
    _callbacks,
    _stateUpdated,
    _debugLevel,
  ]);

  const _updateState = (newState) => {
    setState(newState);
    set_stateUpdated(true);
  };

  const _udpateAction = (action) => {
    setAction(action);
    set_actionUpdated(true);
  };

  //
  //  Websocket / Webrtc _states triggered _actions
  useEffect(() => {
    if (
      wsClientState === SS_STATES.SS_CONNECTED &&
      wrtcClientState === WR_STATES.WRTC_IDLE &&
      _state !== STATES.MBS_ST_SS_CONNECTION_SUCCESSFUL
    )
      _updateState(STATES.MBS_ST_SS_CONNECTION_SUCCESSFUL);

    if (
      wrtcClientState === WR_STATES.WRTC_INIT_SUCCESS &&
      _state !== STATES.MBS_ST_WRTC_INIT_SUCCESSFUL
    )
      _updateState(STATES.MBS_ST_WRTC_INIT_SUCCESSFUL);

    if (
      wrtcClientState === WR_STATES.WRTC_REMOTE_ICE_CANDIDATE_RECEIVED &&
      _state !== STATES.MBS_ST_WRTC_PAIRING_SUCCESSFUL
    )
      _updateState(STATES.MBS_ST_WRTC_PAIRING_SUCCESSFUL);

    if (
      wrtcClientState === WR_STATES.WRTC_VIDEO_INITIALIZED &&
      _state !== STATES.MBS_ST_WRTC_VIDEO_INITIALIZED
    )
      _updateState(STATES.MBS_ST_WRTC_VIDEO_INITIALIZED);
  }, [_state, wrtcClientState, wsClientState]);

  //
  //  private actions
  const startSSConnection = () =>
    _udpateAction(ACTIONS.MBS_AC_START_SS_CONNECTION);
  const startPairing = () => _udpateAction(ACTIONS.MBS_AC_START_PAIRING);

  //  Action useEffect reducer
  useEffect(() => {
    if (!_actionUpdated) return;

    switch (_action) {
      case ACTIONS.MBS_AC_START_SS_CONNECTION:
        startSignalingServerConnection();
        break;
      case ACTIONS.MBS_AC_START_PAIRING:
        startWebRTCPairing();
        break;
      case ACTIONS.MBS_AC_CREATE_OFFER:
        createWebRTCOffer();
        break;
      default:
        break;
    }
    set_actionUpdated(false);
  }, [
    _action,
    _actionUpdated,
    createWebRTCOffer,
    startSignalingServerConnection,
    startWebRTCPairing,
  ]);

  return {
    //  Exposed internal state vars / refs
    mbsState: _state,
    //  State setters
    mbsSetDebugLevel: set_debugLevel,
    mbsSetMode: setMode,
    //  Action triggers
    mbsStartConnection: startSSConnection,
    mbsStartPairing: startPairing,
    mbsCreateOffer: createWebRTCOffer,
    mbsSetCallbacks: setCallbacks,
    mbsSetAutostart: setAutostart,
    //  Callbacks (Experimental)
    mbsOnAPIReady: onMBSReady,
    mbsOnConnectionSuccess: onMBSConnectionSuccess,
    mbsOnWebRTCInitSuccess: onMBSWebRTCInitSuccess,
    mbsOnCreateWebRTCOfferSuccess: onMBSCreateWebRTCOfferSuccess,
    mbsOnWebRTCICEExchangeSuccess: onMBSWebRTCICEExchangeSuccess,
    mbsOnWebRTCPairingSuccess: onMBSWebRTCPairingSuccess, // Same as previsous
    mbsOnVideoInitialized: onMBSVideoInitialized,
  };
};

export default useMediaBrokerServiceAPI;
