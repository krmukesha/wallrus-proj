import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/styles/withStyles";
import styles from "../../styles";

const UXBox = ({ classes, children, className, size }) => {
  let boxSizeClass = classes.box;
  switch (size) {
    case "lg":
      boxSizeClass = `${classes.box} + ${className}`;
      break;
    default:
      boxSizeClass = `${classes.shortBox} + ${className}`;
  }
  return <div className={boxSizeClass}>{children}</div>;
};
UXBox.propTypes = {
  classes: PropTypes.object,
  size: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  className: PropTypes.string,
};

export default withStyles(styles)(UXBox);
