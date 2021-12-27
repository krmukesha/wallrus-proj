import React, { useState } from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";

import styles from "./styles";
import WalkthroughView from "./view";

// const qs = require("query-string");
import qs from "query-string";

const getSteps = () => {
  return [
    "System Requirements",
    "Terms and Conditions",
    "Sign In",
    "Permissions",
    "Pedestal Setup",
    "Done",
  ];
};

const DEBUG = true;

const Walkthrough = ({ classes, ...props }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [termsChecked, setTermsChecked] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [speedTestResults, setSpeedTestResults] = useState({
    validated: false,
    data: {},
  });

  const [noButtonStatus, setNoButtonStatus] = useState(false);

  const handleNext = () => {
    if (DEBUG && activeStep === 1) {
      setActiveStep(3);
    } else {
      setActiveStep(activeStep + 1);
    }
  };
  const handleBack = () => {
    if (DEBUG && activeStep === 3) {
      setActiveStep(1);
    } else {
      setActiveStep(activeStep - 1);
    }
  };
  const handleReset = () => setActiveStep(0);

  const handleTerms = (event) => setTermsChecked(event.target.checked);
  const handlePermissionsGranted = () => setPermissionsGranted(true);
  const handleSpeedTestResults = (results) => setSpeedTestResults(results);

  const handleNoButton = (status) => setNoButtonStatus(status);

  const isNextButtonDisabled = () =>
    // (!DEBUG && activeStep === 0 && !speedTestResults.validated) ||

    // eslint-disable-next-line no-undef
    (process.env.NODE_ENV === "production" &&
      activeStep === 0 &&
      !speedTestResults.validated) ||
    (activeStep === 1 && !termsChecked) ||
    (activeStep === 3 && !permissionsGranted);

  const stepActions = () => {
    switch (activeStep) {
      case 1:
        return "Accept";
      case 2:
        return "Login";
      case 6:
        return "Done";
      default:
        break;
    }
    return "Next";
  };

  const goToDashboard = () => {
    const queryString = props.location.search;

    props.history.push({
      pathname: "/dashboard",
      search: queryString,
    });
  };

  const goToGamePlayerPage = () => {
    // const queryString = this.props.location.search;

    props.history.push({
      pathname: "/gameplayer",
      // search: queryString,
    });
  };

  const queryString = "some-string"; // this.props.location.search;

  return (
    <WalkthroughView
      classes={classes}
      queryString={queryString}
      parsed={queryString ? qs.parse(queryString) : {}}
      steps={getSteps()}
      // Navigation
      activeStep={activeStep}
      handleNext={handleNext}
      handleBack={handleBack}
      handleReset={handleReset}
      stepActions={stepActions}
      goToDashboard={goToDashboard}
      goToGamePlayerPage={goToGamePlayerPage}
      // State
      permissionsGranted={permissionsGranted}
      handlePermissionsGranted={handlePermissionsGranted}
      handleNoButton={handleNoButton}
      noButtonStatus={noButtonStatus}
      speedTestResults={speedTestResults}
      handleSpeedTestResults={handleSpeedTestResults}
      termsChecked={termsChecked}
      handleTerms={handleTerms}
      isNextButtonDisabled={isNextButtonDisabled}
    />
  );
};
Walkthrough.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default withRouter(withStyles(styles)(Walkthrough));
