import React from "react";
import PropTypes from "prop-types";

import ConfirmStepView from "./view";

const ConfirmStep = ({ classes }) => {
  return <ConfirmStepView classes={classes} />;
};

ConfirmStep.propTypes = {
  classes: PropTypes.object,
};

export default ConfirmStep;
