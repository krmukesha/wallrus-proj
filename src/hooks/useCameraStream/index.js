import { useState, useRef, useEffect, useCallback } from "react";
import * as CAM_STATES from "./constants/camStates";
import * as PEM_STATES from "./constants/permissionStates";

const useMediaStream = ({
  videoContainerRef,
  mediaConstraints = {
    audio: false,
    video: true,
  },
  errorCallback = () => {},
  successCallback = () => {},
}) => {
  const [camStreamState, setcamStreamState] = useState(CAM_STATES.STANDBY);
  const [permissionState, setpermissionState] = useState(
    PEM_STATES.NOT_REQUESTED,
  );
  const [camStreamError, setcamStreamError] = useState();
  const camStreamRef = useRef();
  const videoObjRef = useRef();

  function createWebRtcVideo() {
    let video = document.createElement("video");
    video.id = "streamingVideo";
    video.playsInline = true;
    // video.autoplay = true;
    return video;
  }

  const handleSuccess = useCallback(() => {
    const videoContainer = videoContainerRef.current;
    videoObjRef.current = videoContainer.appendChild(createWebRtcVideo());
    const videoTracks = camStreamRef.current.getVideoTracks();

    console.log("Got stream with constraints:", mediaConstraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = camStreamRef.current; // make variable available to browser console
    videoObjRef.current.srcObject = camStreamRef.current;
    videoObjRef.current.play();

    setcamStreamState(CAM_STATES.RUNNING);
    successCallback();
  }, [mediaConstraints, successCallback, videoContainerRef]);

  const handleError = useCallback(() => {
    if (camStreamError.name === "ConstraintNotSatisfiedError") {
      const v = mediaConstraints.video;
      console.error(
        `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`,
      );
    } else if (camStreamError.name === "PermissionDeniedError") {
      console.error(
        "Permissions have not been granted to use your camera and " +
          "microphone, you need to allow the page access to your devices in " +
          "order for the demo to work.",
      );
    } else {
      console.error(
        `getUserMedia error: ${camStreamError.name}`,
        camStreamError,
      );
    }
    errorCallback();
  }, [camStreamError, errorCallback, mediaConstraints.video]);

  const init = useCallback(async () => {
    try {
      camStreamRef.current = await navigator.mediaDevices.getUserMedia(
        mediaConstraints,
      );
      setpermissionState(PEM_STATES.GRANTED);
    } catch (e) {
      setpermissionState(PEM_STATES.ERROR);
      setcamStreamError(e);
    }
  }, [mediaConstraints]);

  useEffect(() => {
    switch (permissionState) {
      case PEM_STATES.GRANTED:
        if (videoContainerRef.current) handleSuccess();
        break;
      case PEM_STATES.ERROR:
        handleError();
        break;
      case PEM_STATES.NOT_REQUESTED:
      default:
        init();
        break;
    }
  }, [handleError, handleSuccess, init, permissionState, videoContainerRef]);

  const handlePauseStream = () => videoObjRef.current.pause();
  const handleStopStream = () => videoObjRef.current.pause();
  useEffect(() => {
    switch (camStreamState) {
      case CAM_STATES.PAUSED:
        handlePauseStream();
        break;
      case CAM_STATES.STOPPED:
        handleStopStream();
        break;
      default:
        break;
    }
  }, [camStreamState]);

  return {
    permissionState,
    camStreamState,
    camStreamError,
    camStreamRef,
    videoObjRef,
  };
};

export default useMediaStream;
