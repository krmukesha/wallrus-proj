import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import {
  BoolGauge,
  NumberGauge,
  GaugeGridItem,
  GaugeGroupContainer,
} from "../../../../theme/components/Gauges";

const TouchScreenJoystickMonitor = ({ state, refs }) => {
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
          <BoolGauge label="Pressed" value={isPressed} />
          <BoolGauge label="Dragging" value={isDragged} />
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
TouchScreenJoystickMonitor.propTypes = {
  state: PropTypes.object,
  refs: PropTypes.object,
};

export default TouchScreenJoystickMonitor;
