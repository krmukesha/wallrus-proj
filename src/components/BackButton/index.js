import React from "react";
import PropTypes from "prop-types";
import styles from "./styles";
import BackButtonView from "./view";
import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";

const BackButton = (props) => {
  const { classes } = props;
  return <BackButtonView classes={classes} />;
};

BackButton.propTypes = {
  classes: PropTypes.object,
};

export default withRouter(withStyles(styles)(BackButton));
