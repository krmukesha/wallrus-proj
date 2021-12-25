import React from "react";
import PropTypes from "prop-types";

const ErrorMessageView = (props) => <div {...props}>{props.children}</div>;

ErrorMessageView.propTypes = {
  children: PropTypes.object,
};

export default ErrorMessageView;
