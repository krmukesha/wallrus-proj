/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import PropTypes from "prop-types";
import * as renderStates from "./constants";

const StandByView = () => <>StandBy</>;

const LoadingView = () => <>Loading...</>;

const RunningView = () => <>Video is playing</>;

const StoppedView = () => <>Video has stopped</>;

const ErrorView = () => <>There has been an error</>;

const StreamingVideoPlayerView = ({ state, videoElementRef }) => (
  <>
    {console.log(videoElementRef)}
    {state === renderStates.SVP_STANDBY && <StandByView />}
    {state === renderStates.SVP_LOADING && <LoadingView />}
    {state === renderStates.SVP_RUNNING && <RunningView />}
    {state === renderStates.SVP_STOPPED && <StoppedView />}
    {state === renderStates.SVP_ERROR && <ErrorView />}
    {videoElementRef && (
      <video
        id="streamingVideo"
        autoPlay={true}
        playsInline={true}
        ref={videoElementRef}
      />
    )}
  </>
);
StreamingVideoPlayerView.displayName = "StreamingVideoPlayerView";

StreamingVideoPlayerView.propTypes = {
  state: PropTypes.string,
  videoElementRef: PropTypes.object,
};

export default StreamingVideoPlayerView;
