import React, { useRef } from "react";
import PropTypes from "prop-types";
import TouchScreenView from "./view";

const TouchScreen = ({ touchScreenLayerRef, displayMonitor, children }) => {
  const _touchScreenLayerRef = useRef(touchScreenLayerRef);
  return (
    <TouchScreenView
      displayMonitor={displayMonitor}
      tslRef={_touchScreenLayerRef}
    >
      {children}
    </TouchScreenView>
  );
};

TouchScreen.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  displayMonitor: PropTypes.bool,
  touchScreenLayerRef: PropTypes.any,
};

export default TouchScreen;
