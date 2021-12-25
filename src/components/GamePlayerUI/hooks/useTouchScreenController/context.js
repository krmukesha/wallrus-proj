import React from "react";

const TouchScreenJoystickContext = React.createContext({
  state: {
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
      boundDistance: 10,
    },
    subscribers: {
      onPressed: [],
      onReleased: [],
      onDragged: [],
    },
  },
  dispatch: () => {},
});

export default TouchScreenJoystickContext;
