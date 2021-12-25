import React, { useState } from "react";
import PropTypes from "prop-types";
import SignUpPageView from "./view";
import styles from "./styles";

import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";

// const numeral = require("numeral");
import numeral from "numeral";
numeral.defaultFormat("0");

const getSteps = () => {
  return ["User", "Signin", "Permission"];
};

// class SignUpPage extends Component {
const SignUpPage = ({ classes }) => {
  const [activeStep, setactiveStep] = useState(0);
  const [receivingAccount, setreceivingAccount] = useState("");
  const [termsChecked, settermsChecked] = useState(false);
  const [loading, setloading] = useState(true);
  const [labelWidth, setlabelWidth] = useState(0);

  const handleNext = () => {
    setactiveStep(activeStep + 1);
    // if (this.state.activeStep === 2) {
    //   setTimeout(() => this.props.history.push("/dashboard"), 5000);
    // }
  };

  const handleBack = () => setactiveStep(activeStep + 1);

  const handleReset = () => setactiveStep(0);

  const handleChange = (event) => {
    setreceivingAccount(event.target.value);
    // this.setState({ [event.target.name]: event.target.value });
  };

  const handleTerms = (event) => {
    settermsChecked(event.target.checked);
  };

  const stepActions = () => {
    if (activeStep === 0) {
      return "Sign in";
    }
    if (activeStep === 1) {
      return "Next";
    }
    if (activeStep === 2) {
      return "Accept";
    }
    return "Next";
  };

  const steps = getSteps();

  return (
    <SignUpPageView
      classes={classes}
      activeStep={activeStep}
      steps={steps}
      loading={loading}
      receivingAccount={receivingAccount}
      termsChecked={termsChecked}
      labelWidth={labelWidth}
      handleNext={handleNext}
      handleBack={handleBack}
      handleTerms={handleTerms}
      handleReset={handleReset}
      handleChange={handleChange}
      stepActions={stepActions}
      // Don't know where these go:
      setloading={setloading}
      setlabelWidth={setlabelWidth}
    />
  );
};
SignUpPage.propTypes = {
  classes: PropTypes.object,
};

export default withRouter(withStyles(styles)(SignUpPage));
