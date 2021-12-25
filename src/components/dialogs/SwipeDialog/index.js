import React, { useState } from "react";
import PropTypes from "prop-types";
import SwipeDialogView from "./view";
import styles from "./styles";

import { withRouter } from "react-router-dom";
import withStyles from "@material-ui/styles/withStyles";

const tutorialSteps = [
  {
    label: "A first label",
    description: "This is the first item on the label",
    imgPath:
      "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "A second label",
    description: "This is the second item on the label",
    imgPath:
      "https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "A third label",
    description: "This is the third item on the label",
    imgPath:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80",
  },
  {
    label: "A fifth label",
    description: "This is the fifth item on the label",
    imgPath:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Other label",
    description: "This is other label",
    imgPath:
      "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
  },
];

// class SwipeDialog extends Component {
const SwipeDialog = ({ classes, open, onClose }) => {
  const maxSteps = tutorialSteps.length;
  const [activeStep, setactiveStep] = useState(0);

  const handleNext = () => setactiveStep(activeStep + 1);

  const handleBack = () => setactiveStep(activeStep + 1);

  const handleStepChange = (step) => setactiveStep(step);

  return (
    <SwipeDialogView
      open={open}
      onClose={onClose}
      classes={classes}
      activeStep={activeStep}
      tutorialSteps={tutorialSteps}
      maxSteps={maxSteps}
      handleNext={handleNext}
      handleBack={handleBack}
      handleStepChange={handleStepChange}
    />
  );
};
SwipeDialog.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default withRouter(withStyles(styles)(SwipeDialog));
