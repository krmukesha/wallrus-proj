import React from "react";

const IMUContext = React.createContext({
  state: {
    isOrientationListenerOn: false,
    isMotionListenerOn: false,
    orientationDeviceSource: "",
    orientationReferenceMode: "",
    accelerationGravityMode: false,
    quaternionsComputation: false,
  },
  refs: {
    data: {
      current: {},
    },
    timer: {
      current: {},
    },
  },
});

export default IMUContext;
