import React from "react";
import PropTypes from "prop-types";

const TouchScreenJoystickView = ({ tslRef, children }) => (
  <div id="TouchScreen-Joystick">
    <div id="TCJS-Control-Layer" ref={tslRef}></div>
    {children}
  </div>
);

TouchScreenJoystickView.propTypes = {
  tslRef: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default TouchScreenJoystickView;
