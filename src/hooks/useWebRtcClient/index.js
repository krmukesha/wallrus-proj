import { useCallback, useEffect, useRef, useState } from "react";
//import socketIOClient from "socket.io-client";
import WebRtcPlayer from "../../models/WebRtcPlayerModel";
import * as ACTIONS from "./constants/WebRtcClientActions";
import * as SS_STATES from "./constants/SignalingServerStates";
import * as WR_STATES from "./constants/WebRtcClientStates";
import * as DC_STATES from "./constants/DataChannelStates";

const WS_OPEN_STATE = 1;

const DEBUG_PREFIX = "[ DEBUG - WebRTC Client ]";

const logInfo = (msg, dump = "NaN") =>
  dump !== "NaN"
    ? console.info(DEBUG_PREFIX, msg, dump)
    : console.info(DEBUG_PREFIX, msg);

const _debugLevel = 0;

const useWebRtcClient = ({ ws, ssEndpoint }) => {
  // const useWebRtcClient = ({ ws, ssEndpoint, setForceUpdate }) => {
  let wsConnection = useRef(ws ? ws : null);
  let webRtcPlayerInstance = useRef();
  let playerIdRef = useRef(); // For Streamer and Cirrus compatibility
  let videoContainerRef = useRef(); // Video container container
  let videoElementRef = useRef(); // Video element container

  const [_action, setAction] = useState("");
  const [_actionUpdated, set_actionUpdated] = useState(false);
  const [wsClientState, setWsClientState] = useState(SS_STATES.SS_IDLE);
  const [wrtcClientState, setWrtcClientState] = useState(WR_STATES.WRTC_IDLE);
  const [dataChannelState, setDataChannelState] = useState(DC_STATES.NULL);
  const [signalingServerConf, setSignalingServerConf] = useState();

  // Start WebRTCObj
  const onConfig = (wsmsg) => {
    logInfo("config received: ", wsmsg);
    setSignalingServerConf(wsmsg);
  };

  // Receive offer in WebRTCObj, start stats. [ STREAMER ]
  const onWebRtcOffer = (wsmsg) => {
    logInfo("offer received: ", wsmsg);

    const webRTCData = wsmsg;
    playerIdRef.current = { playerId: wsmsg.playerId };
    logInfo("PlayerID: ", playerIdRef.current);
    webRtcPlayerInstance.current.receiveOffer(webRTCData);
    webRtcPlayerInstance.current.createAnswer(); //  wsmsg.playerId Required only for this example
  };

  // Receive answer in WebRTCObj, start stats. [ PLAYER ]
  const onWebRtcAnswer = (wsmsg) => {
    setWrtcClientState(WR_STATES.WRTC_ANSWER_RECEIVED);
    logInfo("answer received: ", wsmsg);

    const webRTCData = wsmsg;
    webRtcPlayerInstance.current.receiveAnswer(webRTCData);
  };

  // Receive candidate in WebRTCObj
  const onWebRtcIce = (wsmsg) => {
    setWrtcClientState(WR_STATES.WRTC_REMOTE_ICE_CANDIDATE_RECEIVED);
    logInfo("ICE candidate received: ", wsmsg);

    const iceCandidate = wsmsg;
    logInfo("onWebRtcIce [debug]", webRtcPlayerInstance);
    webRtcPlayerInstance.current.handleCandidateFromServer(iceCandidate);
  };

  // Connect and Init WS
  const handleInitWSConnection = useCallback(() => {
    setWsClientState(SS_STATES.SS_CONNECTING);

    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
      alert("Your browser doesn't support WebSocket");
      return;
    }

    wsConnection.current = new WebSocket(ssEndpoint);

    wsConnection.current.onopen = () => {
      logInfo("Connection successful");
      setWsClientState(SS_STATES.SS_CONNECTED);
    };

    wsConnection.current.onmessage = function (event) {
      logInfo(`<- SS: ${event.data}`);
      let msg = JSON.parse(event.data);
      if (msg.type === "config") {
        onConfig(msg);
      } else if (msg.type === "playerCount") {
        // updateKickButton(msg.count - 1);
      } else if (msg.type === "answer") {
        // Active ( PLAYER_TYPE ) state
        setWrtcClientState(WR_STATES.WRTC_ANSWER_RECEIVED);
        onWebRtcAnswer(msg);
      } else if (msg.type === "offer") {
        // Passive ( STREAMER_TYPE ) state
        setWrtcClientState(WR_STATES.WRTC_OFFER_RECEIVED);
        onWebRtcOffer(msg);
      } else if (msg.type === "iceCandidate") {
        setWrtcClientState(WR_STATES.WRTC_REMOTE_ICE_CANDIDATE_RECEIVED);

        playerIdRef.current = { playerId: msg.playerId };

        onWebRtcIce(msg.candidate);
      } else {
        logInfo(`invalid SS message type: ${msg.type}`);
      }
    };

    wsConnection.current.onerror = function (event) {
      // console.log(`WS error: ${JSON.stringify(event)}`);
      console.error(
        `WS error: ${JSON.stringify(event, [
          "message",
          "arguments",
          "type",
          "name",
        ])}`,
      );
    };

    wsConnection.current.onclose = function (event) {
      logInfo(`WS closed: ${JSON.stringify(event.code)} - ${event.reason}`);
      wsConnection.current = undefined;
      // is_reconnection = true;
      // destroy `webRtcPlayerInstance` if any
      // let playerDiv = document.getElementById('player');
      // if ( webRtcPlayerInstance && webRtcPlayerInstance.current) {
      //   // playerDiv.removeChild(webRtcPlayerInstance.current.video);
      //   webRtcPlayerInstance.current.close();
      //   webRtcPlayerInstance.current = undefined;
      // }

      // showTextOverlay(`Disconnected: ${event.reason}`);
      // var reclickToStart = setTimeout(start, 4000);
    };
  }, [ssEndpoint]);

  const createWebRtcOffer = useCallback(() => {
    setWrtcClientState(WR_STATES.WRTC_CREATE_OFFER_START);

    if (webRtcPlayerInstance.current) {
      logInfo("Creating offer");
      // showTextOverlay('Starting connection to server, please wait');
      webRtcPlayerInstance.current.createOffer();
    } else {
      console.error("WebRTC player not setup, cannot create offer");
      // showTextOverlay('Unable to setup video');
      setWrtcClientState(WR_STATES.WRTC_CREATE_OFFER_ERROR);
    }
  }, []);

  const handleInitWrtcPlayer = useCallback(() => {
    setWrtcClientState(WR_STATES.WRTC_INIT_START);

    const peerConfParams = {
      peerConnectionOptions: signalingServerConf.peerConnectionOptions,
    };
    const ws = wsConnection.current;

    //  [ PLAYER ]
    const onWebRtcOffer = function (offer) {
      if (ws && ws.readyState === WS_OPEN_STATE) {
        setWrtcClientState(WR_STATES.WRTC_CREATE_OFFER_SUCCESS);

        let offerStr = JSON.stringify(offer);
        logInfo(`-> SS: offer:\n${offerStr}`);
        ws.send(offerStr);
        return;
      }
      setWrtcClientState(WR_STATES.WRTC_CREATE_OFFER_ERROR);
    };

    // [ STREAMER ]
    const onWebRtcAnswer = function (answer) {
      if (ws && ws.readyState === WS_OPEN_STATE) {
        setWrtcClientState(WR_STATES.WRTC_CREATE_ANSWER_SUCCESS);

        const answerStr = JSON.stringify(answer).replace(
          /}$/,
          `,"playerId":${playerIdRef.current.playerId}}`,
        );
        logInfo(`-> SS: answer:\n${answerStr}`);
        ws.send(answerStr);
        return;
      }
      setWrtcClientState(WR_STATES.WRTC_CREATE_ANSWER_ERROR);
    };

    const onWebRtcCandidate = function (candidate) {
      if (ws && ws.readyState === WS_OPEN_STATE) {
        setWrtcClientState(WR_STATES.WRTC_LOCAL_ICE_CANDIDATE_SUCCESS);

        const response = playerIdRef.current
          ? {
              type: "iceCandidate",
              candidate: candidate,
              playerId: playerIdRef.current.playerId,
            }
          : { type: "iceCandidate", candidate: candidate };

        logInfo(
          // `-> SS: iceCandidate\n${ JSON.stringify(candidate, undefined, 4) }`
          `-> SS: iceCandidate\n${JSON.stringify(response)}`,
        );
        ws.send(JSON.stringify(response));
        return;
      }
      setWrtcClientState(WR_STATES.WRTC_LOCAL_ICE_CANDIDATE_ERROR);
    };

    const onVideoInitialised = function () {
      logInfo("onVideoInitialised");
      // logInfo("webRtcPlayerInstance: ", webRtcPlayerInstance.current);
      if (ws && ws.readyState === WS_OPEN_STATE) {
        // logInfo("Video is ready");
        setWrtcClientState(WR_STATES.WRTC_VIDEO_INITIALIZED);
      }
    };

    const onDataChannelConnected = function () {
      if (ws && ws.readyState === WS_OPEN_STATE) {
        setDataChannelState(DC_STATES.READY);
        // showTextOverlay("WebRTC connected, waiting for video");
      }
    };

    const onDataChannelMessage = function () {};

    webRtcPlayerInstance.current = new WebRtcPlayer(peerConfParams, {
      videoContainer: videoContainerRef.current,
      videoElement: videoElementRef.current,
      onWebRtcOffer,
      onWebRtcAnswer,
      onWebRtcCandidate,
      onVideoInitialised,
      onDataChannelConnected,
      onDataChannelMessage,
      debugLevel: _debugLevel,
    });
    logInfo("webRtcPlayerInstance: ", webRtcPlayerInstance.current);
    if (!webRtcPlayerInstance.current)
      setWrtcClientState(WR_STATES.WRTC_INIT_ERROR);
    // console.log("init", webRtcPlayerInstance.current);

    // registerInputs(webRtcPlayerInstance.video);

    // On a touch device we will need special ways to show the on-screen keyboard.
    if ("ontouchstart" in document.documentElement) {
      // createOnScreenKeyboardHelpers(htmlElement);
    }

    // createWebRtcOffer();
    //setWrtcClientState("HANDSHAKE");

    // return webRtcPlayerInstance.video;
    setWrtcClientState(WR_STATES.WRTC_INIT_SUCCESS);
  }, [signalingServerConf]);

  //  Debug states
  useEffect(() => {
    logInfo({ _action, wsClientState, wrtcClientState });
  }, [_action, wrtcClientState, wsClientState]);

  //  SetAction Override
  const _setAction = (action) => {
    set_actionUpdated(true);
    setAction(action);
  };

  //
  //  Call-to _actions tied up to _action reducer
  //
  const startSignalingServerConnection = () => {
    // logInfo("startSignalingServerConnection called");
    _setAction(ACTIONS.SS_SERVER_CONNECT);
  };
  const restartSignalingServerConnection = () =>
    _setAction(ACTIONS.SS_SERVER_RECONNECT);
  const killSignalingServerConnection = () =>
    _setAction(ACTIONS.SS_SERVER_DISCONNECT);
  const startWebRTCPairing = () => {
    // logInfo("startWebRTCPairing called");
    _setAction(ACTIONS.WRTC_INIT);
  };
  const createWebRTCOffer = () => _setAction(ACTIONS.WRTC_CREATE_OFFER);

  useEffect(() => {
    // console.log("WRTC action 1", _action, _actionUpdated);
    if (!_actionUpdated) return;

    if (_actionUpdated) {
      switch (_action) {
        case ACTIONS.SS_SERVER_CONNECT:
          // Change to SERVER_CONNECT
          if (wsClientState === SS_STATES.SS_IDLE) {
            logInfo("Connecting to signaling server...");
            handleInitWSConnection();
          }
          set_actionUpdated(false);
          break;
        case ACTIONS.SS_SERVER_RECONNECT:
          // Change to SERVER_RECONNECT
          logInfo("Reconnecting to signaling server...");
          set_actionUpdated(false);
          break;
        case ACTIONS.SS_SERVER_DISCONNECT:
          // Change to SERVER_DISCONNECT
          logInfo("Disconnecting from server...");
          set_actionUpdated(false);
          break;
        case ACTIONS.WRTC_INIT:
          if (
            SS_STATES.SS_CONNECTED &&
            WR_STATES.WRTC_IDLE &&
            signalingServerConf &&
            !webRtcPlayerInstance.current
          ) {
            logInfo("WebRTC object initialization");
            handleInitWrtcPlayer();
          }
          set_actionUpdated(false);
          break;
        case ACTIONS.WRTC_CREATE_OFFER:
          if (
            SS_STATES.SS_CONNECTED &&
            WR_STATES.WRTC_INIT_SUCCESS &&
            webRtcPlayerInstance.current
          ) {
            logInfo("WebRTC object creating offer");
            if (signalingServerConf && webRtcPlayerInstance)
              createWebRtcOffer();
          }
          set_actionUpdated(false);
          break;

        default:
          break;
      }
      // console.log("WRTC action 2", _action, _actionUpdated);
      // set_actionUpdated(false);
    }

    return () => {
      // if (wsConnection.current) wsConnection.current.disconnect();
    };
  }, [
    _action,
    createWebRtcOffer,
    handleInitWSConnection,
    handleInitWrtcPlayer,
    signalingServerConf,
    wsClientState,
    dataChannelState,
    _actionUpdated,
  ]);

  return {
    setAction: _setAction,
    wrtcClientState,
    wsClientState,
    videoContainerRef,
    videoElementRef,
    //
    startSignalingServerConnection,
    restartSignalingServerConnection,
    killSignalingServerConnection,
    startWebRTCPairing,
    createWebRTCOffer,
  };
};

export default useWebRtcClient;
