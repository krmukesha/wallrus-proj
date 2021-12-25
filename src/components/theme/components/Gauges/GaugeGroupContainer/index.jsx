import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import styles from "../../../styles";

const GaugeGroupContainer = ({ classes, children, ...props }) => (
  <Grid
    container
    className={classes.gaugeGroupContainer}
    spacing={0}
    justify="center"
    justifycontent="center"
    alignItems="center"
    {...props}
  >
    {children}
  </Grid>
);
GaugeGroupContainer.propTypes = {
  props: PropTypes.any,
  classes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default withStyles(styles)(GaugeGroupContainer);
