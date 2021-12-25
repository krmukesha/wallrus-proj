import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import BaseDialog from "../BaseDialog";
import { Link } from "react-router-dom";
import MobileStepper from "@material-ui/core/MobileStepper";

import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// const logo = require("../../images/logo.svg");
import logo from "../../../images/logo.svg";

const SwipeDialogView = ({
  classes,
  activeStep,
  handleStepChange,
  tutorialSteps,
  maxSteps,
  handleNext,
  handleBack,
  handleClose,
  ...props
}) => {
  // console.log(props.open);
  return (
    <BaseDialog {...props}>
      <div className={classes.container}>
        <div className={classes.gutterBottom}>
          <img width={100} src={logo} alt="" />
        </div>
        <div>
          <AutoPlaySwipeableViews
            axis="x"
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {tutorialSteps.map((step, index) => (
              <div key={step.label}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <img
                    className={classes.img}
                    src={step.imgPath}
                    alt={step.label}
                  />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            className={classes.mobileStepper}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                Next
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
            }
          />
        </div>
        <div className={classes.stepsContainer}>
          <Typography
            style={{ textTransform: "uppercase" }}
            color="secondary"
            gutterBottom
          >
            {tutorialSteps[activeStep].label}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {tutorialSteps[activeStep].description}
          </Typography>
        </div>
        <div>
          <Button
            component={Link}
            to="/walkthrough"
            variant="contained"
            onClick={handleClose}
            color="primary"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          >
            Getting started
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
};
SwipeDialogView.propTypes = {
  classes: PropTypes.object,
  activeStep: PropTypes.number,
  handleStepChange: PropTypes.func,
  tutorialSteps: PropTypes.array,
  maxSteps: PropTypes.number,
  handleNext: PropTypes.func,
  handleBack: PropTypes.func,
  handleClose: PropTypes.func,
};

export default SwipeDialogView;
