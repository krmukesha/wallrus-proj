import { useState, useRef, useEffect, useCallback } from "react";

import * as STATES from "./constants/ws_states";
import * as ACTIONS from "./constants/ws_actions";

const LOG_PREFIX = "[ DEBUG - WS Client ]";

const logInfo = (msg, dump) =>
  dump !== "NaN"
    ? console.info(`${LOG_PREFIX}`, msg, dump)
    : console.info(`${LOG_PREFIX}`, msg);

const useWebSocketClient = ({
  wsRef,
  endpoint,
  debugLevel,
  //  WS Object callbacks
  onWSOpen,
  onWSClose,
  onWSError,
  onWSMessage,
  //  Hook state callbacks
  onWSReady,
  onWSConnecting,
  onWSConnectionSuccessful,
  onWSConnectionFailed,
  onWSDisconnected,
}) => {
  //  Internal state
  const [_state, setState] = useState(STATES.PROMPT);
  const [_stateUpdated, set_stateUpdated] = useState(false);
  const [_action, setAction] = useState();
  const [_actionUpdated, set_actionUpdated] = useState(false);
  const [_error, setError] = useState("");
  const [_wsEndpoint, set_wsEndpoint] = useState(endpoint);
  const [_debugLevel, set_debugLevel] = useState(debugLevel || 0);
  const [_callbacks, setCallbacks] = useState({
    //  WS object callbacks
    onWSOpen,
    onWSClose,
    onWSError,
    onWSMessage,
    //  Hook state callbacks
    onWSReady,
    onWSConnecting,
    onWSConnectionSuccessful,
    onWSConnectionFailed,
    onWSDisconnected,
  });
  //  Refs
  const wsConnectionRef = useRef(wsRef && wsRef.current);
  const lastMessageRef = useRef("");

  //  State set functions override
  const _updateState = (state) => {
    setState(state);
    set_stateUpdated(true);
  };
  const _updateAction = (action) => {
    setAction(action);
    set_actionUpdated(true);
  };

  //  Actions handles
  const _openWSConnection = useCallback(() => {
    // set_wsEndpoint(ep);
    _updateAction(ACTIONS.OPEN);
  }, []);
  const _initWSConnection = useCallback(
    (ep) => {
      set_wsEndpoint(ep || _wsEndpoint);
      _updateState(STATES.CONNECTING);
    },
    [_wsEndpoint],
  );
  const _closeWSConnection = () => _updateAction(ACTIONS.CLOSE);

  // useEffect(() => {
  //   logInfo({
  //     _state,
  //     _stateUpdated,
  //     _action,
  //     _actionUpdated,
  //     _error,
  //     _wsEndpoint,
  //     _debugLevel,
  //     _callbacks,
  //   });
  // });

  //  Pollyfill for Websockets
  const init = () => {
    // logInfo("Init called");
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
      _updateState(STATES.ERROR);
      setError("Websockets are not supported");
      console.error(`${LOG_PREFIX}`, "Websockets are not supported");
      return false;
    } else {
      _updateState(STATES.READY);
      return true;
    }
  };

  //
  //  WebSocket callbacks declaration
  //
  const _onOpen = useCallback(
    (ev) => {
      _debugLevel > 0 && logInfo("onOpen event", ev);
      _state === STATES.CONNECTING &&
        _updateState(STATES.CONNECTION_SUCCESSFUL);
      _callbacks.onWSOpen && _callbacks.onWSOpen();
    },
    [_callbacks, _debugLevel, _state],
  );

  const _onClose = useCallback(
    (ev) => {
      _debugLevel > 0 && logInfo("onClose event", ev);
      //  previous call to closeWSConnection
      _state !== STATES.DISCONNECTED && _updateState(STATES.DISCONNECTED);
      _callbacks.onWSClose && _callbacks.onWSClose();
    },
    [_callbacks, _debugLevel, _state],
  );

  const _onError = useCallback(
    (ev) => {
      _debugLevel > 0 && console.error(`${LOG_PREFIX}`, "onError event", ev);
      _callbacks.onWSError && _callbacks.onWSError();
      _updateState(
        _state === STATES.CONNECTING ? STATES.CONNECTION_FAILED : STATES.ERROR,
      );
    },
    [_callbacks, _debugLevel, _state],
  );

  const _onMessage = useCallback(
    (ev) => {
      lastMessageRef.current = ev.data;
      _debugLevel > 0 && logInfo("onMessage event", ev);
      _callbacks.onWSMessage && _callbacks.onWSMessage(ev.data);
    },
    [_callbacks, _debugLevel],
  );

  const _createConnection = (ep) => {
    let ws;
    try {
      ws = new WebSocket(ep);
    } catch (e) {
      console.error("Exception @ useWebSocket when creating a new socket:", e);
    }
    return ws || null;
  };

  const openWSConnection = useCallback(
    (ep) => {
      _debugLevel > 0 &&
        logInfo("Opening connection to WebSocket", ep || endpoint);
      if (!ep && !endpoint) {
        console.error(
          "No endpoint has been defined. Either define one when instantiating this hook or set it with the setEndpoint function",
        );
      }

      wsConnectionRef.current = _createConnection(
        _wsEndpoint || endpoint || ep,
      );

      //  Callbacks assignment
      wsConnectionRef.current.onopen = (ev) => _onOpen(ev);
      wsConnectionRef.current.onclose = (ev) => _onClose(ev);
      wsConnectionRef.current.onerror = (ev) => _onError(ev);
      wsConnectionRef.current.onmessage = (ev) => _onMessage(ev);

      // _updateState(STATES.CONNECTING);
    },
    [
      _debugLevel,
      _onClose,
      _onError,
      _onMessage,
      _onOpen,
      _wsEndpoint,
      endpoint,
    ],
  );

  const closeWSConnection = useCallback(() => {
    if (wsConnectionRef.current != null && _state !== STATES.DISCONNECTED) {
      _debugLevel > 0 && logInfo("Closing connection to WebSocket");
      wsConnectionRef.current.close();
      wsConnectionRef.current = null;
      _updateState(STATES.DISCONNECTED);
    } else {
      console.warn(`${LOG_PREFIX}`, "No WebSocket connection was opened.");
    }
  }, [_debugLevel, _state]);

  const send = (data) => {
    wsConnectionRef.current && wsConnectionRef.current.send(data);
  };

  //
  //  OnMount useEffect
  //
  useEffect(() => {
    // logInfo("initial useEffect");
    init();
    return () => {
      wsConnectionRef.current = null;
      lastMessageRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  //  State useEffect reducer
  useEffect(() => {
    // logInfo("state useEffect reducer");
    if (!_stateUpdated) return;

    switch (_state) {
      case STATES.READY:
        _debugLevel > 0 && logInfo("Ready");
        _callbacks.onWSReady && _callbacks.onWSReady();
        set_stateUpdated(false);
        break;
      case STATES.CONNECTING:
        _debugLevel > 0 && logInfo("Connecting");
        _callbacks.onWSConnecting && _callbacks.onWSConnecting();
        _openWSConnection();
        set_stateUpdated(false);
        break;
      case STATES.CONNECTION_SUCCESSFUL:
        _debugLevel > 0 && logInfo("Connection successful");
        _callbacks.onWSConnectionSuccessful &&
          _callbacks.onWSConnectionSuccessful();
        set_stateUpdated(false);
        break;
      case STATES.CONNECTION_FAILED:
        _debugLevel > 0 && logInfo("Connection failed");
        _callbacks.onWSConnectionFailed && _callbacks.onWSConnectionFailed();
        set_stateUpdated(false);
        break;
      case STATES.DISCONNECTED:
        _debugLevel > 0 && logInfo("Disconnected");
        _callbacks.onWSDisconnected && _callbacks.onWSDisconnected();
        set_stateUpdated(false);
        break;
      default:
        break;
    }
  }, [_state, _stateUpdated, _callbacks, _openWSConnection, _debugLevel]);

  //
  //  Action useEffect reducer
  useEffect(() => {
    // logInfo("action useEffect reducer");
    if (!_actionUpdated) return;
    switch (_action) {
      case ACTIONS.OPEN:
        openWSConnection();
        break;
      case ACTIONS.CLOSE:
        closeWSConnection();
        break;
      default:
        break;
    }
    set_actionUpdated(false);
  }, [_action, _actionUpdated, closeWSConnection, openWSConnection]);

  return {
    //  Exposed local state / refs
    wsConnState: _state,
    wsConnError: _error,
    wsRefTest: wsConnectionRef,
    //  Params setters
    wsSetEndpoint: set_wsEndpoint,
    wsSetCallbacks: setCallbacks,
    wsSetDebugLevel: set_debugLevel,
    //  Triggers / functions
    wsInitConnection: _initWSConnection,
    wsCloseConnection: _closeWSConnection,
    wsSend: send,
  };
};
export default useWebSocketClient;
