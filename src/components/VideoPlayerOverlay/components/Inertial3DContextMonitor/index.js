import React from "react";
import PropTypes from "prop-types";
import Inertial3DContextMonitorView from "./view";

const Inertial3DContextMonitor = ({ monitorConsoleRef }) => {
  // Either I set a timer that triggers an update with forceUpdate, or I send a variable from the parent comp that changes with the time.

  // console.log("monitorConsoleRef", monitorConsoleRef);
  return <Inertial3DContextMonitorView textFieldRef={monitorConsoleRef} />;
};
Inertial3DContextMonitor.propTypes = {
  updateTriggered: PropTypes.bool,
  monitorConsoleRef: PropTypes.object,
};

export default Inertial3DContextMonitor;
