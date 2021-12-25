import React from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/styles/withStyles";
import styles from "./styles";
import ButtonBarView from "./view";

const ButtonBar = (props) => {
  const { classes } = props;
  return <ButtonBarView classes={classes} />;
};

ButtonBar.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ButtonBar);
