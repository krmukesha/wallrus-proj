import { useEffect, useRef, useState } from "react";
import {
  initQRCodeReader,
  clearQRCodeReader,
} from "../../helpers/qrCodeScanner";

//  TODO :: Pass in the permissions state for the camera as an argument, always, then don't try anything if this is not granted
const useQRCodeScanner = () => {
  const videoObjRef = useRef();
  const streamRef = useRef();
  const trackMediaRef = useRef();
  const [qrCodeData, setqrCodeData] = useState();
  // const { state } = useContext(PermissionsContext);

  const createWebRtcVideo = () => {
    let video = document.createElement("video");
    video.id = "streamingVideo";
    video.playsInline = true;
    // video.autoplay = true;
    return video;
  };

  const handleSuccess = () => {
    trackMediaRef.current = streamRef.current.getVideoTracks()[0];
    window.stream = streamRef.current; // make variable available to browser console
    videoObjRef.current.srcObject = streamRef.current;
    videoObjRef.current.play();
  };

  const startScanner = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "environment",
        },
      });

      handleSuccess();
    } catch (e) {
      console.error("Should have tested for this before: ", e);
    }

    initQRCodeReader({
      vdHandler: videoObjRef.current,
      trHandler: trackMediaRef.current,
      scanInterval: 1000,
      callback: (data) => data && setqrCodeData(data),
    });
  };

  const clearScanner = () => {
    clearQRCodeReader();
    videoObjRef.current = null;
    trackMediaRef.current = null;
  };

  useEffect(() => {
    videoObjRef.current = createWebRtcVideo();
    return () => clearScanner() && clearQRCodeReader();
  }, []);

  // useEffect(() => {
  //   switch (state.camera) {
  //     case camStates.CAM_PERMS_NOT_REQUESTED:
  //       break;
  //     default:
  //       break;
  //   }
  //   return () => clearScanner();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return { startScanner, clearScanner, qrCodeData };
};
export default useQRCodeScanner;
