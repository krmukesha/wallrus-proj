import { useState, useReducer, useEffect, useLayoutEffect } from "react";
import {
  registerTouchEvents,
  registerFakeMouseEvents,
  registerMouseHoverEvents,
} from "./helpers/lvsdm";

//  Hook Stuff
import { controlActions, eventsActions } from "./constants";
import { default as APIContext } from "./context";
import { default as APIReducer } from "./reducers";

// const DRAG_TIMEOUT = 500;

const useTouchScreenController = ({
  controlRef,
  displayMonitor,
  touchScreenLayerRef,
  defaultMouseEventsMode,
  //  Touchscreen Monitor refs
  coordXMonitorRef,
  coordYMonitorRef,
  nomForceXMonitorRef,
  nomForceYMonitorRef,
  netForceXMonitorRef,
  netForceYMonitorRef,
  //  Callbacks
  onTouchScreenTouchEnd = () => {},
  onTouchScreenTouchMove = () => {},
  onTouchScreenTouchStart = () => {},
}) => {
  const [_callbacks, set_callbacks] = useState({
    onTouchScreenTouchEnd,
    onTouchScreenTouchMove,
    onTouchScreenTouchStart,
  });
  // const _touchScreenLayerRef = useRef(touchScreenLayerRef);
  const _touchScreenLayerRef = touchScreenLayerRef;

  const _controlRef = controlRef;
  // const _dragTimerRef = useRef();
  // console.log("TSJ_TSJ initial - ", _controlRef, touchScreenLayerRef);

  //  Monitor domElements refs
  const _coordXMonitorRef = coordXMonitorRef;
  const _coordYMonitorRef = coordYMonitorRef;
  const _nomForceXMonitorRef = nomForceXMonitorRef;
  const _nomForceYMonitorRef = nomForceYMonitorRef;
  const _netForceXMonitorRef = netForceXMonitorRef;
  const _netForceYMonitorRef = netForceYMonitorRef;

  const [state, dispatch] = useReducer(APIReducer, {
    events: {
      isPressed: [false, 0],
      isDragged: [false, 0],
      isListening: [false, 0],
    },
    control: {
      isLockedHorizontal: false,
      isLockedVertical: false,
      isOriginLocked: false,
      gainH: 1,
      gainV: 1,
      offsetLeft: 0,
      offsetTop: 0,
      screenWidth: 0,
      screenHeight: 0,
      screenHalfWidth: 0, //  Will help accelerate things
      screenHalfHeight: 0, // //  Will help accelerate things
      boundDistance: 10,
    },
    subscribers: {
      onPressed: [],
      onReleased: [],
      onDragged: [],
    },
  });
  const {
    events: eventsState,
    control: controlState,
    // subscribers: subscribersState,
  } = state;
  // console.log("TSJ - ", { eventsState, controlState, subscribersState });

  const [_mouseEventsMode] = useState(defaultMouseEventsMode ?? true);

  const updateMonitor = ({
    x,
    y,
    nominalForce_x,
    nominalForce_y,
    netForce_x,
    netForce_y,
  }) => {
    _coordXMonitorRef.current.innerHTML = x.toFixed(2);
    _coordYMonitorRef.current.innerHTML = y.toFixed(2);
    _nomForceXMonitorRef.current.innerHTML = nominalForce_x.toFixed(2);
    _nomForceYMonitorRef.current.innerHTML = nominalForce_y.toFixed(2);
    _netForceXMonitorRef.current.innerHTML = netForce_x.toFixed(2);
    _netForceYMonitorRef.current.innerHTML = netForce_y.toFixed(2);
  };

  const updateControlRef = ({
    touches,
    fingerIds,
    offsetLeft,
    offsetTop,
    timestamp,
  }) => {
    let x, y, nominalForce_x, nominalForce_y, netForce_x, netForce_y;
    //  If domElement is not ready, hence undefined...
    const _offsetTop = offsetTop ? offsetTop : controlState.offsetTop;
    const _offsetLeft = offsetLeft ? offsetLeft : controlState.offsetLeft;

    //  Workaround for callback + ref
    const _screenHalfWidth = controlState.screenHalfWidth
      ? controlState.screenHalfWidth
      : _touchScreenLayerRef.current.clientWidth / 2;
    const _screenHalfHeight = controlState.screenHalfHeight
      ? controlState.screenHalfHeight
      : _touchScreenLayerRef.current.clientHeight / 2;

    // Tell the difference between different touch IDs
    let actions = [],
      i = 0;
    for (let touch of touches) {
      //  Finger coordinates on the domElement
      x = touch.clientX - _offsetLeft;
      y = touch.clientY - _offsetTop;

      //  Calculate joystick force
      nominalForce_x = (x - _screenHalfWidth) / _screenHalfWidth;
      nominalForce_y = ((y - _screenHalfHeight) / _screenHalfHeight) * -1;
      netForce_x = nominalForce_x * controlState.gainH;
      netForce_y = nominalForce_y * controlState.gainV;

      // console.log(x, y, touch.clientX, touch.clientY, offsetLeft, offsetTop);
      actions[i] = {
        id: fingerIds[touch.identifier],
        x: touch.clientX - offsetLeft,
        y: touch.clientY - offsetTop,
        touchForce: touch.force,
        nominalForce_x,
        nominalForce_y,
        netForce_x,
        netForce_y,
        lastUpdated: timestamp,
      };
      i++;
    }
    // console.info("TSJ_TSJ - updateControlRef - ", actions);

    displayMonitor && updateMonitor(actions[0]);
    return actions;
  };

  const clearForceControlRef = ({ touches, fingerIds, timestamp }) => {
    const x = 0,
      y = 0,
      nominalForce_x = 0,
      nominalForce_y = 0,
      netForce_x = 0,
      netForce_y = 0;

    let actions = [],
      i = 0;
    for (let touch of touches) {
      actions[i] = {
        id: fingerIds[touch.identifier],
        x,
        y,
        touchForce: touch.force,
        nominalForce_x,
        nominalForce_y,
        netForce_x,
        netForce_y,
        lastUpdated: timestamp,
      };
      i++;
    }
    // console.info("TSJ_TSJ - clearForceControlRef - ", actions);

    displayMonitor && updateMonitor(actions[0]);
    return actions;
  };

  const _onTouchStart = (touches, fingerIds, offsetLeft, offsetTop) => {
    // console.log("TSJ_TSJ - onTouchStart", _controlRef);
    const timestamp = Date.now();
    let controlDataUpdate;
    //  TODO :: May have to remove onPress / onRelease states from context
    //  Makes other state-dependable components to reload, like GamePlayerUI,
    //  hence, forcing this one to reload too.
    // dispatch({
    //   type: eventsActions.ON_PRESSED,
    //   payload: {
    //     timestamp: timestamp,
    //   },
    // });

    if (!controlState.isOriginLocked) {
      controlDataUpdate = updateControlRef({
        touches,
        fingerIds,
        offsetLeft,
        offsetTop,
        timestamp,
      });
      // console.log("TSJ_TSJ - updateControlRef", controlDataUpdate);
      _controlRef.current = {
        ..._controlRef.current,
        ...controlDataUpdate[0],
      };
      // console.log("TSJ_TSJ - onTouchStart:after", _controlRef);
    } else {
      //  Origin is always in the center
      // _controlRef.current = {
      //   ..._controlRef.current,
      //   x_0: 0, //  1/2 screen width
      //   y_0: 0, //  1/2 screen height
      // };
    }
    // subscribersState.onPressed.map((s) => s && s(timestamp));
    _callbacks.onTouchScreenTouchStart(controlDataUpdate);
  };

  const _onTouchEnd = (touches, fingerIds, offsetLeft, offsetTop) => {
    // console.log("TSJ_TSJ - onTouchEnd", _controlRef);
    const timestamp = Date.now();
    let controlDataUpdate;
    //  TODO :: May have to remove onPress / onRelease states from context
    //  Makes other state-dependable components to reload, like GamePlayerUI,
    //  hence, forcing this one to reload too.

    // dispatch({
    //   type: eventsActions.ON_RELEASED,
    //   payload: {
    //     timestamp: timestamp,
    //   },
    // });

    //  Clear out controlRef
    if (!controlState.isOriginLocked) {
      controlDataUpdate = clearForceControlRef({
        touches,
        fingerIds,
        offsetLeft,
        offsetTop,
        timestamp,
      });
      // console.log("TSJ_TSJ - clearForceControlRef", controlDataUpdate);
      _controlRef.current = {
        ..._controlRef.current,
        ...controlDataUpdate[0],
      };
      // console.log("TSJ_TSJ - _onTouchEnd:after", _controlRef);
    } else {
      //  Origin is always in the center
      // _controlRef.current = {
      //   ..._controlRef.current,
      //   x_0: 0, //  1/2 screen width
      //   y_0: 0, //  1/2 screen height
      // };
    }

    // subscribersState.onReleased.map((s) => s(timestamp));

    _callbacks.onTouchScreenTouchEnd(controlDataUpdate);
  };

  const onTouchMove = (touches, fingerIds) => {
    // console.log("TSJ_TSJ - onTouchMove", _controlRef);
    const timestamp = Date.now();
    let controlDataUpdate;

    //  If not isDragged, set it, otherwise, clear timeout and reset it
    // eventsState.isDragged && clearTimeout(_dragTimerRef.current);

    // _dragTimerRef.current = setTimeout(
    //   dispatch({
    //     type: eventsActions.ON_DRAG_START,
    //     payload: {
    //       timestamp: timestamp,
    //     },
    //   }),
    //   DRAG_TIMEOUT,
    // );

    // dispatch({
    //   type: eventsActions.ON_DRAG_STOP,
    //   payload: {
    //     timestamp: timestamp,
    //   },
    // });

    if (!controlState.isOriginLocked) {
      controlDataUpdate = updateControlRef({
        touches,
        fingerIds,
        offsetTop: controlState.offsetTop,
        offsetLeft: controlState.offsetLeft,
        timestamp,
      });
      // console.log("TSJ_TSJ - updateControlRef", controlDataUpdate);
      _controlRef.current = {
        ..._controlRef.current,
        ...controlDataUpdate[0],
      };
      // console.log("TSJ_TSJ - onTouchStart:after", _controlRef);
    } else {
      //  Origin is always in the center
      // _controlRef.current = {
      //   ..._controlRef.current,
      //   x_0: 0, //  1/2 screen width
      //   y_0: 0, //  1/2 screen height
      // };
    }
    // console.log("TSJ_TSJ - onTouchMove:after", _controlRef);

    // subscribersState.onReleased.map((s) => s(timestamp));
    _callbacks.onTouchScreenTouchMove(controlDataUpdate);
  };

  const _initControlDataRef = () => {
    _controlRef.current = {
      id: 0,
      x: 0,
      y: 0,
      touchForce: 0,
      nominalForce_x: 0,
      nominalForce_y: 0,
      netForce_x: 0,
      netForce_y: 0,
      lastUpdated: 0,
    };
  };

  const _startEventsListener = () => {
    const timestamp = Date.now();
    if (_mouseEventsMode) {
      registerTouchEvents({
        onTouchStart: _onTouchStart,
        onTouchEnd: _onTouchEnd,
        onTouchMove: onTouchMove,
        domElement: _touchScreenLayerRef.current,
        preventDefault: true,
      });
    } else {
      //  Register mouse events first
      registerMouseHoverEvents({
        onMouseEnter: () => console.log("onMouseEnter"),
        onMouseLeave: () => console.log("onMouseLeave"),
        onMouseMove: () => console.log("onMouseMove"),
        onMouseDown: () => console.log("onMouseDown"),
        onMouseUp: () => console.log("onMouseUp"),
        onContextMenu: () => console.log("onContextMenu"),
        onMouseWheel: () => console.log("onMouseWheel"),
        domElement: _touchScreenLayerRef.current,
        preventDefault: true,
      });
      //  Register fake mouse events through touch
      registerFakeMouseEvents({
        onFakeTouchStart: () => console.log("onFakeTouchStart"),
        onFakeTouchEnd: () => console.log("onFakeTouchEnd"),
        onFakeTouchMove: () => console.log("onFakeTouchMove"),
        domElement: _touchScreenLayerRef.current,
        preventDefault: true,
      });
    }
    //  Set offset values
    dispatch({
      type: controlActions.SET_OFFSET,
      payload: {
        offsetLeft: _touchScreenLayerRef.current.offsetLeft,
        offsetTop: _touchScreenLayerRef.current.offsetTop,
      },
    });

    //  Set offset values
    dispatch({
      type: controlActions.SET_SCREEN_DIMENSIONS,
      payload: {
        screenWidth: _touchScreenLayerRef.current.clientWidth,
        screenHeight: _touchScreenLayerRef.current.clientHeight,
      },
    });

    //  Set isListening to true
    dispatch({
      type: eventsActions.ON_LISTEN_START,
      payload: timestamp,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  // onMount useEffect
  useEffect(() => {
    if (!_controlRef || !_controlRef.current)
      _controlRef.current = {
        id: 0,
        x: 0,
        y: 0,
        touchForce: 0,
        nominalForce_x: 0,
        nominalForce_y: 0,
        netForce_x: 0,
        netForce_y: 0,
        lastUpdated: Date.now(),
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  OnMount useLayoutEffect
  useLayoutEffect(() => {
    if (
      displayMonitor &&
      eventsState.isListening[0] &&
      (!(_coordXMonitorRef && _coordXMonitorRef.current) ||
        !(_coordYMonitorRef && _coordYMonitorRef.current) ||
        !(_nomForceXMonitorRef && _nomForceXMonitorRef.current) ||
        !(_nomForceYMonitorRef && _nomForceYMonitorRef.current) ||
        !(_netForceXMonitorRef && _netForceXMonitorRef.current) ||
        !(_netForceYMonitorRef && _netForceYMonitorRef.current))
    )
      console.error("Some monitor references have not been instantiated.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    //  Context
    touchScreenState: state,
    TouchScreenContext: APIContext,
    touchScreenDispatcher: dispatch,
    //  Params setters
    touchScreenSetCallbacks: set_callbacks,
    touchScreenRegisterEvents: _startEventsListener,
    touchScreenInitControlDataRef: _initControlDataRef,
  };
};

export default useTouchScreenController;
