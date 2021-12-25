import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import styles from "../../../styles";

const GaugeItemContainer = ({ classes, children }) => (
  <Grid className={classes.gaugeItemContainer}>{children}</Grid>
);
GaugeItemContainer.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default withStyles(styles)(GaugeItemContainer);
