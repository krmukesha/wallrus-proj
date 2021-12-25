import React, { useRef, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import SysRequirementsStepView from "./view";
import {
  // getOS,
  // getBrowser,
  isOSSupported,
  isBrowserSupported,
} from "./helpers";

import Speedtest from "../../../../services/speedtest";

import { GetRecommendationView } from "./helpers/recommendation_helper";
import * as rTypes from "./constants";
import * as TEST_STATES from "./constants/testStates";

import { useUserAgent } from "../../../../hooks";

const DEBUG = true;

const stServer = {
  name: "LibreSpeed Backend",
  // eslint-disable-next-line no-undef
  server: process.env.REACT_APP_SPEED_TEST_SERVICE_URL || "",
  dlURL: "garbage.php",
  ulURL: "empty.php",
  pingURL: "empty.php",
  getIpURL: "getIP.php",
};

const MIN_DL_SPEED = 2;
const MIN_UL_SPEED = 1;

const SysRequirementsStep = ({
  classes,
  speedTestResults,
  handleSpeedTestResults,
}) => {
  const [state, setstate] = useState(TEST_STATES.PROMPT);
  const { os, browser } = useUserAgent();

  const speedTestClient = useRef(new Speedtest());
  const [stState, setSTState] = useState(speedTestResults.validated ? 4 : 0);
  const [speedTestData, setSpeedTestData] = useState(speedTestResults.data);

  const [validations, setValidations] = useState({
    os: isOSSupported(os.name, os.version) ? true : false,
    browser: isBrowserSupported(browser.name, browser.version) ? true : false,
    connection: false,
  });

  const speedTestInit = () => {
    console.info("Speed Test init");
    // speedTestClient.current.onupdate = data => setSpeedTestData(data)
    speedTestClient.current.onupdate = (data) => {
      // console.table(data)
      setSpeedTestData(data);
    };
    speedTestClient.current.onend = (aborted) => {
      if (aborted) {
        console.log("User aborted the speed test");
      } else {
        console.log("Speed test finished gracefully");
      }
      setSTState(speedTestClient.current.getState());
    };

    speedTestClient.current.addTestPoint(stServer);
    // console.log( speedTestClient.current.getState() )
    // speedTestClientTgr()
    setSTState(speedTestClient.current.getState());
  };
  const speedTestServersSetup = () => {
    console.info("Speed Test servers setup");
    // speedTestClient.current.addTestPoint(stServer)
    speedTestClient.current.setSelectedServer(stServer);
    // console.log( speedTestClient.current.getState() );
    // speedTestClientTgr()
    setSTState(speedTestClient.current.getState());
  };
  const speedTestStart = () => {
    console.info("Speed Test starting");
    speedTestClient.current.start();
    // console.log( speedTestClient.current.getState() );
    // speedTestClientTgr();
    setSTState(speedTestClient.current.getState());
  };
  const speedTestRunning = () => {
    console.info("Speed Test running");
    // console.log( speedTestClient.current.getState() )
  };
  const speedTestDone = useCallback(() => {
    console.info("Speed Test done");
    handleSpeedTestResults({ validated: true, data: speedTestData });
    setValidations({
      ...validations,
      connection:
        speedTestData.dlStatus > MIN_DL_SPEED &&
        speedTestData.ulStatus > MIN_UL_SPEED
          ? true
          : false,
    });
    console.log(speedTestClient.current.getState());
  }, [handleSpeedTestResults, speedTestData, validations]);

  useEffect(() => {
    if (speedTestResults.validated) return;

    switch (stState) {
      case 0:
        DEBUG && console.info("Speed test @ prompt state");
        break;
      case 1:
        speedTestServersSetup();
        break;
      case 2:
        speedTestStart();
        break;
      case 3:
        speedTestRunning();
        break;
      case 4:
        speedTestDone();
        break;
      default:
        console.error(`Uknown speed test state (Got ${stState}).`);
        break;
    }
  }, [stState, speedTestResults, speedTestDone]);

  const computedRequirements = [
    !validations.os
      ? {
          id: "os",
          label: "Operative System",
          text: <GetRecommendationView type={rTypes.BROWSER_RECOMMENDATION} />,
        }
      : null,
    !validations.browser
      ? {
          id: "browser",
          label: "Internet Browser",
          text: <GetRecommendationView type={rTypes.BROWSER_RECOMMENDATION} />,
        }
      : null,
    !validations.connection && speedTestResults.validated
      ? {
          id: "connection",
          label: "Internet Connection",
          text: (
            <GetRecommendationView type={rTypes.CONNECTION_RECOMMENDATION} />
          ),
        }
      : null,
  ].filter((e) => e != null);

  const handleStartTest = () => {
    // eslint-disable-next-line no-undef
    console.log(process.env.REACT_APP_SPEED_TEST_SERVICE_URL);
    speedTestInit();
    setstate(TEST_STATES.RUNNING);
  };

  return (
    <SysRequirementsStepView
      classes={classes}
      //
      os={os.name}
      state={state}
      version={os.version}
      browserName={browser.name}
      browserVersion={browser.version}
      speedTestData={speedTestData}
      recommendations={computedRequirements}
      startTestCallback={handleStartTest}
    />
  );
};

SysRequirementsStep.propTypes = {
  classes: PropTypes.object,
  speedTestResults: PropTypes.object,
  handleSpeedTestResults: PropTypes.func,
};

export default SysRequirementsStep;
