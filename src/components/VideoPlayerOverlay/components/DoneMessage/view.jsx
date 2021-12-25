import React from "react";
import PropTypes from "prop-types";

const DoneMessageView = (props) => <div {...props}>{props.children}</div>;

DoneMessageView.propTypes = {
  children: PropTypes.object,
};

export default DoneMessageView;
