import React, { useRef, useState, useReducer, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import TouchScreenJoystickView from "./view";
import { TouchScreenJoystickMonitor } from "./components";
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

const TouchScreenJoystick = ({
  displayMonitor,
  touchScreenLayoutRef,
  defaultMouseEventsMode,
  // controlRef,
}) => {
  const _touchScreenLayoutRef = useRef(touchScreenLayoutRef);
  // const _controlRef = useRef(
  //   controlRef.current ?? {
  //     id: 0,
  //     x: 0,
  //     y: 0,
  //     touchForce: 0,
  //     nominalForce_x: 0,
  //     nominalForce_y: 0,
  //     netForce_x: 0,
  //     netForce_y: 0,
  //     lastUpdated: 0,
  //   },
  // );
  const _controlRef = useRef({
    id: 0,
    x: 0,
    y: 0,
    touchForce: 0,
    nominalForce_x: 0,
    nominalForce_y: 0,
    netForce_x: 0,
    netForce_y: 0,
    lastUpdated: 0,
  });

  // const _controlRef = controlRef;
  // const _dragTimerRef = useRef();
  console.log("TSJ_TSJ initial - ", _controlRef);

  //  Monitor domElements refs
  const coordXMonitorRef = useRef();
  const coordYMonitorRef = useRef();
  const nomForceXMonitorRef = useRef();
  const nomForceYMonitorRef = useRef();
  const netForceXMonitorRef = useRef();
  const netForceYMonitorRef = useRef();

  const [state, dispatch] = useReducer(APIReducer, {
    events: {
      isPressed: [false, 0],
      isDragged: [false, 0],
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
    subscribers: subscribersState,
  } = state;
  console.log("TSJ - ", { eventsState, controlState, subscribersState });

  const [_mouseEventsMode] = useState(defaultMouseEventsMode ?? true);

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
      : _touchScreenLayoutRef.current.clientWidth / 2;
    const _screenHalfHeight = controlState.screenHalfHeight
      ? controlState.screenHalfHeight
      : _touchScreenLayoutRef.current.clientHeight / 2;

    // Tell the difference between different touch IDs
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
      _controlRef.current = {
        ..._controlRef.current,
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
    }
    console.info("TSJ_TSJ - updateControlRef - ", _controlRef.current);

    if (displayMonitor) {
      coordXMonitorRef.current.innerHTML = x.toFixed(2);
      coordYMonitorRef.current.innerHTML = y.toFixed(2);
      nomForceXMonitorRef.current.innerHTML = nominalForce_x.toFixed(2);
      nomForceYMonitorRef.current.innerHTML = nominalForce_y.toFixed(2);
      netForceXMonitorRef.current.innerHTML = netForce_x.toFixed(2);
      netForceYMonitorRef.current.innerHTML = netForce_y.toFixed(2);
    }
  };

  const clearForceControlRef = ({
    touches,
    fingerIds,
    // offsetLeft,
    // offsetTop,
    timestamp,
  }) => {
    const x = 0,
      y = 0,
      nominalForce_x = 0,
      nominalForce_y = 0,
      netForce_x = 0,
      netForce_y = 0;

    // const x, y, nominalForce_x, nominalForce_y, netForce_x, netForce_y;

    for (let touch of touches) {
      _controlRef.current = {
        ..._controlRef.current,
        id: fingerIds[touch.identifier],
        x, // touch.clientX - offsetLeft, returns NaN
        y, // touch.clientY - offsetTop,  returns NaN
        touchForce: touch.force,
        nominalForce_x,
        nominalForce_y,
        netForce_x,
        netForce_y,
        lastUpdated: timestamp,
      };
    }
    // console.info(_controlRef.current);

    if (displayMonitor) {
      coordXMonitorRef.current.innerHTML = x.toFixed(2);
      coordYMonitorRef.current.innerHTML = y.toFixed(2);
      nomForceXMonitorRef.current.innerHTML = nominalForce_x.toFixed(2);
      nomForceYMonitorRef.current.innerHTML = nominalForce_y.toFixed(2);
      netForceXMonitorRef.current.innerHTML = netForce_x.toFixed(2);
      netForceYMonitorRef.current.innerHTML = netForce_y.toFixed(2);
    }
  };

  const onTouchMove = (touches, fingerIds) => {
    console.log("TSJ_TSJ - onTouchMove", _controlRef);
    const timestamp = Date.now();

    updateControlRef({
      touches,
      fingerIds,
      offsetLeft: controlState.offsetLeft,
      offsetTop: controlState.offsetTop,
      timestamp,
    });

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

    // subscribersState.onReleased.map((s) => s(timestamp));
  };

  //  Initial useLayoutEffect
  useLayoutEffect(() => {
    if (_mouseEventsMode) {
      registerTouchEvents({
        // onTouchStart: () => console.log("onTouchStart"),
        onTouchStart: (touches, fingerIds, offsetLeft, offsetTop) => {
          console.log("TSJ_TSJ - onTouchStart", _controlRef);
          const timestamp = Date.now();
          // dispatch({
          //   type: eventsActions.ON_PRESSED,
          //   payload: {
          //     timestamp: timestamp,
          //   },
          // });
          if (!controlState.isOriginLocked) {
            console.log("TSJ_TSJ - updateControlRef");
            updateControlRef({
              touches,
              fingerIds,
              offsetLeft,
              offsetTop,
              timestamp,
            });
          } else {
            //  Origin is always in the center
            // _controlRef.current = {
            //   ..._controlRef.current,
            //   x_0: 0, //  1/2 screen width
            //   y_0: 0, //  1/2 screen height
            // };
          }
          console.log("TSJ_TSJ - onTouchStart:after", _controlRef);

          // subscribersState.onPressed.map((s) => s(timestamp));
        },
        // onTouchEnd: () => console.log("onTouchEnd"),
        onTouchEnd: (touches, fingerIds, offsetLeft, offsetTop) => {
          console.log("TSJ_TSJ - onTouchEnd", _controlRef);
          const timestamp = Date.now();
          dispatch({
            type: eventsActions.ON_RELEASED,
            payload: {
              timestamp: timestamp,
            },
          });

          //  Clear out controlRef
          if (!controlState.isOriginLocked) {
            clearForceControlRef({
              touches,
              fingerIds,
              offsetLeft,
              offsetTop,
              timestamp,
            });
          } else {
            //  Origin is always in the center
            // _controlRef.current = {
            //   ..._controlRef.current,
            //   x_0: 0, //  1/2 screen width
            //   y_0: 0, //  1/2 screen height
            // };
          }
          console.log("TSJ_TSJ - onTouchStart:after", _controlRef);

          // subscribersState.onReleased.map((s) => s(timestamp));
        },
        // onTouchMove: () => console.log("onTouchMove"),
        onTouchMove: onTouchMove,
        domElement: _touchScreenLayoutRef.current,
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
        domElement: _touchScreenLayoutRef.current,
        preventDefault: true,
      });
      //  Register fake mouse events through touch
      registerFakeMouseEvents({
        onFakeTouchStart: () => console.log("onFakeTouchStart"),
        onFakeTouchEnd: () => console.log("onFakeTouchEnd"),
        onFakeTouchMove: () => console.log("onFakeTouchMove"),
        domElement: _touchScreenLayoutRef.current,
        preventDefault: true,
      });
    }
    //  Set offset values
    dispatch({
      type: controlActions.SET_OFFSET,
      payload: {
        offsetLeft: _touchScreenLayoutRef.current.offsetLeft,
        offsetTop: _touchScreenLayoutRef.current.offsetTop,
      },
    });

    //  Set offset values
    dispatch({
      type: controlActions.SET_SCREEN_DIMENSIONS,
      payload: {
        screenWidth: _touchScreenLayoutRef.current.clientWidth,
        screenHeight: _touchScreenLayoutRef.current.clientHeight,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <APIContext.Provider value={{ state, dispatch }}>
      <TouchScreenJoystickView tslRef={_touchScreenLayoutRef}>
        {displayMonitor && (
          <TouchScreenJoystickMonitor
            state={{
              isPressed: eventsState.isPressed[0],
              isDragged: eventsState.isDragged[0],
              x: 0.0,
              y: 0.0,
              force: 0.5,
              speed: 0.5,
            }}
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
      </TouchScreenJoystickView>
    </APIContext.Provider>
  );
};
TouchScreenJoystick.propTypes = {
  displayMonitor: PropTypes.bool,
  controlRef: PropTypes.object,
  touchScreenLayoutRef: PropTypes.object,
  defaultMouseEventsMode: PropTypes.bool,
};

export default TouchScreenJoystick;
