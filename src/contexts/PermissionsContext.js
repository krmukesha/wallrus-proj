import React from "react";

const PermissionsContext = React.createContext({
  state: {
    camera: false,
    motionSensors: false,
  },
  dispatch: () => {},
});
export default PermissionsContext;
