/**
 * For implementation, use the following at the top:
 * import { useOnResizeListener, useTimer } from "../../hooks";
 * import { TIMER_MID_RFR } from "../../hooks/useTimer/constants";
 * 
 * Then, use it like this:
 * const { elapsedMilis, done, startTimer } = useTimer({
    duration: 2000,
    refreshRate: TIMER_MID_RFR,
  });

 * Then, run this once using useEffect:
  // Timer settings
    // setRefreshRate(refreshRates.MID_RES);
    startTimer();
 */

import { useRef, useEffect, useState, useCallback } from "react";
import {
  TIMER_MID_RFR,
  TIMER_HIGH_RFR,
  TIMER_LOW_RFR,
  // TIMER_STATE_STANDBY,
  // TIMER_STATE_RUNNING,
  // TIMER_STATE_PAUSED,
  // TIMER_STATE_DONE,
} from "./constants";

const useTimer = ({
  duration = 0,
  customTimerRef = null,
  refreshRate = null,
}) => {
  // const [initialDuration, setInitialDuration] = useState(duration);
  const [elapsedMilis, setElapsedMilis] = useState(duration);
  const [pause, setPause] = useState(false);
  const [done, setDone] = useState(false);
  const [refRate, setRefreshRate] = useState(refreshRate);

  let timerRef = useRef(customTimerRef);
  let counterRef = useRef();

  const _updateElapsed = useCallback(
    () => refRate && setElapsedMilis((prev) => prev - refRate),
    [refRate],
  );

  const _start = () => {
    timerRef.current = setTimeout(() => setDone(true), duration);
    counterRef.current = setInterval(_updateElapsed, refRate);
  };

  // TODO : Keep an initialDuration and a pausedDuration
  // const togglePause = () => {
  //   if (pause) {
  //     clearInterval(timerRef.current);
  //     setPause(!pause);
  //     return !pause;
  //   } else {
  //     if (elapsedMilis > 0 && !done) {
  //       // timerRef.current = setTimeout(setDone(true), 100);
  //       // timerRef.current = setInterval(decreaseNum, 100);
  //       setPause(!pause);
  //       return !pause;
  //     } else {
  //       console.error("Timer must be reseted or recreated with duration > 0.");
  //     }
  //   }
  // };

  const _reset = useCallback(() => {
    timerRef.current && clearTimeout(timerRef.current, true);
    counterRef.current && clearInterval(counterRef.current, true);
    setPause(false);
    setDone(false);
    setElapsedMilis(duration);
  }, [duration]);

  //  Startup routine
  useEffect(() => {
    _reset();

    const counterToBeCleaned = counterRef.current;
    return () => {
      clearTimeout(timerRef.current, true);
      clearInterval(counterToBeCleaned, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  Timer done routine
  useEffect(() => {
    if (done) {
      clearTimeout(timerRef.current, true);
      clearInterval(counterRef.current, true);
      setElapsedMilis(0);
    }

    const counterToBeCleaned = counterRef.current;
    return () => {
      clearTimeout(timerRef.current, true);
      clearInterval(counterToBeCleaned, true);
    };
  }, [done]);

  const startTimer = () => !pause && !done && _start();
  const resetTimer = () => _reset();
  const resetAndStartTimer = () => _reset && startTimer();

  return {
    timerRef: timerRef.current,
    elapsedMilis,
    pause,
    done,
    // togglePause,
    setRefreshRate,
    startTimer,
    resetTimer,
    resetAndStartTimer,
    refreshRates: {
      TIMER_LOW_RFR,
      TIMER_MID_RFR,
      TIMER_HIGH_RFR,
    },
  };
};

export default useTimer;
