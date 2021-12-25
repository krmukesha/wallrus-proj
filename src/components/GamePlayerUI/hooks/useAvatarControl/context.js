import React from "react";
const AvatarControlContext = React.createContext({
  configurations: {
    motionAdapter: () => {},
    orientaitonAdapter: () => {},
  },
  ref: {
    current: {
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0,
      yaw: 0,
      pitch: 0,
      roll: 0,
      timestamp: 0,
    },
  },
});
export default AvatarControlContext;
