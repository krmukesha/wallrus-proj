import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import {
  BoolGauge,
  NumberGauge,
  GaugeGridItem,
  GaugeGroupContainer,
} from "../../../theme/components/Gauges";

import useTouchScreenEventsState from "../../hooks/useTouchScreenEventsState";

const TouchScreenMonitor = ({ refs }) => {
  const state = useTouchScreenEventsState();
  const { isPressed, isDragged } = state;
  const {
    coordXRef,
    coordYRef,
    nomForceXRef,
    nomForceYRef,
    netForceXRef,
    netForceYRef,
  } = refs;
  return (
    <div id="TCJS-Monitor-Layer">
      <GaugeGridItem>
        <Typography style={{ color: "#FFF", textAlign: "center" }}>
          TouchScreen Joystick Monitor
        </Typography>
      </GaugeGridItem>
      <GaugeGridItem>
        <GaugeGroupContainer>
          <BoolGauge label="Pressed" value={isPressed[0]} />
          <BoolGauge label="Dragging" value={isDragged[0]} />
          <NumberGauge
            label="x"
            // value={!coordXRef.current && x}
            elementRef={coordXRef}
          />
          <NumberGauge
            label="y"
            // value={!coordYRef.current && y}
            elementRef={coordYRef}
          />
          <NumberGauge label="Nom X Force" elementRef={nomForceXRef} />
          <NumberGauge label="Nom Y Force" elementRef={nomForceYRef} />
          <NumberGauge label="Net X Force" elementRef={netForceXRef} />
          <NumberGauge label="Net Y Force" elementRef={netForceYRef} />
        </GaugeGroupContainer>
      </GaugeGridItem>
    </div>
  );
};
TouchScreenMonitor.propTypes = {
  state: PropTypes.object,
  refs: PropTypes.object,
};

export default TouchScreenMonitor;
