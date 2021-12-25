import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import { GaugeItemContainer } from "../";
import styles from "../../../styles";

const NumberGauge = ({
  label,
  value,
  classes,
  elementRef,
  decPrecision = 1,
}) => {
  return (
    <GaugeItemContainer>
      <Typography className={classes.numberGaugeLabel}>{label}</Typography>
      {value !== undefined ? (
        <Typography className={classes.numberGaugeValue}>
          {Number.parseFloat(value).toFixed(decPrecision).toString()}
        </Typography>
      ) : (
        <Typography
          className={classes.numberGaugeValue}
          innerRef={elementRef}
        ></Typography>
      )}
    </GaugeItemContainer>
  );
};

NumberGauge.propTypes = {
  decPrecision: PropTypes.number,
  elementRef: PropTypes.object,
  classes: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.number,
};

export default withStyles(styles)(NumberGauge);
