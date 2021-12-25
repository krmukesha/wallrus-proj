import React from "react";
import PropTypes from "prop-types";
import InfoStepView from "./view";

const InfoStep = ({ classes }) => {
  return <InfoStepView classes={classes} />;
};

InfoStep.propTypes = {
  classes: PropTypes.object,
  goToGamePlayerPage: PropTypes.func,
};

export default InfoStep;
