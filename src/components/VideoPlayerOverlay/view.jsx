import React from "react";
import PropTypes from "prop-types";

const VideoPlayerOverlayView = ({ children, isHidden }) => (
  <div
    id="videoPlayOverlay"
    className={isHidden ? "hiddenState" : "clickableState"}
  >
    {children}
  </div>
);

VideoPlayerOverlayView.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isHidden: PropTypes.bool,
};

export default VideoPlayerOverlayView;
