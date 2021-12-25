import React from "react";
import PropTypes from "prop-types";

const PlayButtonView = (props) => <div {...props}>{props.children}</div>;

PlayButtonView.propTypes = {
  children: PropTypes.any,
};

export default PlayButtonView;
