// import React, { useRef, useLayoutEffect } from "react";
import React from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { withStyles } from "@material-ui/styles";
import styles from "../../styles";

const UXConsole = ({
  textFieldRef,
  // value,
  classes,
  className,
  fullWidthBreakpoints,
}) => {
  const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <TextField
      // ref={textFieldRef}
      // inputRef={textFieldRef}
      className={`${className ? className : classes.uxConsoleWrapper} ${
        matches ? classes.fullWidth : ""
      }`}
      id="outlined-multiline-static"
      // label="Multiline"
      multiline
      rows={4}
      // defaultValue="Default Value"
      variant="outlined"
      // value={value || ""}
      fullWidth={fullWidthBreakpoints && matches}
      InputProps={{
        inputRef: textFieldRef,
        className: classes.uxConsole,
      }}
    />
  );
};

UXConsole.propTypes = {
  textFieldRef: PropTypes.object,
  value: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  fullWidthBreakpoints: PropTypes.bool,
};

export default withStyles(styles)(UXConsole);
