import React from "react";
import PropTypes from "prop-types";

import TermsStepView from "./view";

const TermsStep = ({ classes, termsChecked, handleTerms }) => {
  return (
    <TermsStepView
      classes={classes}
      termsChecked={termsChecked}
      handleTerms={handleTerms}
    />
  );
};
TermsStep.propTypes = {
  classes: PropTypes.object,
  termsChecked: PropTypes.bool,
  handleTerms: PropTypes.func,
};

export default TermsStep;
