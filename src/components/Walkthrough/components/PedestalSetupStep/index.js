import React, { useEffect } from "react";
import PropTypes from "prop-types";
import PedestalSetupStepView from "./view";

import { useQRCodeScanner } from "../../../../hooks";

const PedestalSetupStep = ({ classes, handleNext }) => {
  const { startScanner, clearScanner, qrCodeData } = useQRCodeScanner();

  useEffect(() => {
    startScanner();
    return () => clearScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(qrCodeData);
    if (qrCodeData) {
      clearScanner();
      handleNext();
    }
  }, [clearScanner, handleNext, qrCodeData]);

  return <PedestalSetupStepView classes={classes} />;
};

PedestalSetupStep.propTypes = {
  classes: PropTypes.object,
  handleNext: PropTypes.func,
};

export default PedestalSetupStep;
