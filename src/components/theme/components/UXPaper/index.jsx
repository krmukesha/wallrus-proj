import React from "react";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
// import Paper as MUIPaper from "@material-ui/core/Paper";
import withStyles from "@material-ui/styles/withStyles";
import styles from "../../styles";

const UXPaper = ({ children }) => {
  return <Paper className="paper">{children}</Paper>;
};
UXPaper.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default withStyles(styles)(UXPaper);
