import { useRef, useEffect } from "react";

const useOnResizeListener = ({ handler, element = window }) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener("resize", eventListener);

    return () => {
      element.removeEventListener("resize", eventListener);
    };
  }, [element]);

  return { savedHandler };
};

export default useOnResizeListener;
