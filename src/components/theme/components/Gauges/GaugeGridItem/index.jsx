import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styles from "../../../styles";

const GaugeGridItem = ({ classes, children, ...props }) => (
  <Grid item className={classes.gaugeGridItem} {...props}>
    {children}
  </Grid>
);
GaugeGridItem.propTypes = {
  props: PropTypes.any,
  classes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
export default withStyles(styles)(GaugeGridItem);
