import React from "react";
import PropTypes from "prop-types";
import * as rTypes from "../constants";

const GetRecommendationView = ({ type }) => {
  switch (type) {
    case rTypes.OS_RECOMMENDATION:
      return (
        <>
          Your OS is not supported by this application. Please try one of the
          following:
          <ul>
            <li>Try using a mobile device</li>
            <li>Try updating your OS version</li>
            <li>Try using another device</li>
          </ul>
        </>
      );
    case rTypes.BROWSER_RECOMMENDATION:
      return (
        <>
          Your Browser is not supported by this application. Please try one of
          the following:
          <ul>
            <li>Try updating your browser version</li>
            <li>Try using another browser</li>
          </ul>
        </>
      );
    case rTypes.CONNECTION_RECOMMENDATION:
      return (
        <>
          Your connection is not strong enough. Please try the following:
          <ul>
            <li>Try changing your internet provider to one with 5G</li>
          </ul>
        </>
      );
    default:
      return;
  }
};
GetRecommendationView.propTypes = {
  type: PropTypes.string,
};

export { GetRecommendationView };
