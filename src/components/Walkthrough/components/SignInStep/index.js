import React from "react";
import PropTypes from "prop-types";
import SignInStepView from "./view";

const SignInStep = ({ classes, handleNext }) => {
  return <SignInStepView classes={classes} handleNext={handleNext} />;
};

SignInStep.propTypes = {
  classes: PropTypes.object,
  handleNext: PropTypes.func,
};

export default SignInStep;
