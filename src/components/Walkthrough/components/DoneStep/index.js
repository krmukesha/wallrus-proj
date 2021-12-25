import React from "react";
import PropTypes from "prop-types";

import DoneStepView from "./view";

const DoneStep = ({ classes, goToGamePlayerPage }) => {
  return <DoneStepView onClick={goToGamePlayerPage} classes={classes} />;
};

DoneStep.propTypes = {
  classes: PropTypes.object,
  goToGamePlayerPage: PropTypes.func,
};

export default DoneStep;
