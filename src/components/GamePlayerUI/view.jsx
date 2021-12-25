/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import PropTypes from "prop-types";
import VideoPlayerOverlay from "../../components/VideoPlayerOverlay";
import StreamingVideoPlayer from "../../components/StreamingVideoPlayer";
import "./styles.css";

const GamePlayerUIView = React.forwardRef(
  ({ gpUIState, onClickStart }, ref) => (
    <div id="playerUI" className="forwardRef">
      <div id="player" ref={ref}>
        <VideoPlayerOverlay gpUIState={gpUIState} onClickStart={onClickStart} />
        <StreamingVideoPlayer
          onClickStart={onClickStart}
          gpUIState={gpUIState}
          videoElementRef={ref}
        />
      </div>
    </div>
  ),
);

GamePlayerUIView.displayName = "GamePlayerUIView";

GamePlayerUIView.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  gpUIState: PropTypes.string,
  onClickStart: PropTypes.func,
};

export default GamePlayerUIView;
