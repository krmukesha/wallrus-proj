import React, { useState } from "react";
import PropTypes from "prop-types";
import VideoPlayerOverlayView from "./view";
import {
  PlayButton,
  DoneMessage,
  ErrorMessage,
  Inertial3DContextMonitor,
} from "./components";

import * as uiStates from "../GamePlayerUI/constants/gamePlayerUIStates";
import * as STATES from "../GamePlayerUI/constants/states";

const VideoPlayerOverlay = ({
  gpUIState,
  mbsState,
  // misState,
  onClickStart,
  HUDDisplay,
  monitorConsoleRef,
  // updateTriggered,
  children,
}) => {
  const [isHidden, toggleHidden] = useState(false);
  const [_HUDDisplay] = useState(HUDDisplay || false);

  const onHideHandler = () => {
    toggleHidden(!isHidden);
    onClickStart();
  };

  return (
    <VideoPlayerOverlayView isHidden={isHidden}>
      {/* {`gpUIState is ${gpUIState}`} */}
      {/* {gpUIState === uiStates.GPUI_ST_IDLE && (
        <PlayButton
          onClickCallback={onHideHandler}
          labelTxt="Start Fullscreen"
        />
      )} */}

      {/* {gpUIState === uiStates.GPUI_ST_VIDEO_LOADING && "Video Loading"} */}
      {mbsState === STATES.MBS_LOADING_STREAM && "Video Loading"}

      {/* {gpUIState === uiStates.GPUI_ST_VIDEO_READY && (
        <PlayButton onClickCallback={onHideHandler} labelTxt="Start" />
      )} */}

      {mbsState === STATES.MBS_STREAM_LOADED && (
        <PlayButton onClickCallback={onHideHandler} labelTxt="Start" />
      )}

      {gpUIState === uiStates.GPUI_ST_ENDED && (
        <DoneMessage messageTxt={"Thank you!"} />
      )}
      {gpUIState === uiStates.GPUI_ST_ERROR && (
        <ErrorMessage messageTxt={"Experience Ended"} />
      )}
      {_HUDDisplay && process.env.NODE_ENV === "development" && (
        <Inertial3DContextMonitor monitorConsoleRef={monitorConsoleRef} />
      )}

      {/* Nested children */}
      {children}
    </VideoPlayerOverlayView>
  );
};
VideoPlayerOverlay.propTypes = {
  mbsState: PropTypes.string,
  // misState: PropTypes.string,
  gpUIState: PropTypes.string,
  onClickStart: PropTypes.func,
  HUDDisplay: PropTypes.bool,
  monitorConsoleRef: PropTypes.object,
  updateTriggered: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default VideoPlayerOverlay;
