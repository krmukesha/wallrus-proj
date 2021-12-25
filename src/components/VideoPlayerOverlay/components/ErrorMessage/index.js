import React from "react";
import PropTypes from "prop-types";
import ErrorMessageView from "./view";

const ErrorMessage = ({ messageTxt, id = "", classes = "" }) => {
  return (
    <ErrorMessageView id={id} className={classes}>
      {messageTxt}
    </ErrorMessageView>
  );
};
ErrorMessage.propTypes = {
  messageTxt: PropTypes.string,
  id: PropTypes.string,
  classes: PropTypes.object,
};
export default ErrorMessage;
