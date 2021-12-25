import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { Chip } from "@material-ui/core";
import { GaugeItemContainer } from "../";
import styles from "../../../styles";

const BoolGauge = ({ classes, label, value }) => {
  return (
    <GaugeItemContainer>
      <Chip
        label={label}
        color="primary"
        variant={value ? "default" : "outlined"}
        className={classes.boolGaugeValue}
      />
    </GaugeItemContainer>
  );
};

BoolGauge.propTypes = {
  elementRef: PropTypes.object,
  classes: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.bool,
};

export default withStyles(styles)(BoolGauge);
