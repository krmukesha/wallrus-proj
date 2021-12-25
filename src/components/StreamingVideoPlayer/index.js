import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import StreamingVideoPlayerView from "./view";
import * as renderStates from "./constants";

const StreamingVideoPlayer = ({ videoElementRef }) => {
  const [renderState, setrenderState] = useState();

  //  Initial useEffect
  useEffect(() => {
    setrenderState(renderStates.SVP_STANDBY);

    return () => {
      //  Kill videoRef instance
    };
  }, []);

  return (
    <StreamingVideoPlayerView
      state={renderState}
      videoElementRef={videoElementRef}
    />
  );
};

StreamingVideoPlayer.propTypes = {
  videoElementRef: PropTypes.object,
};

export default StreamingVideoPlayer;
