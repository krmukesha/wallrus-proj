import React from "react";
import PropTypes from "prop-types";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { UXConsole } from "../../../theme/components";

const Inertial3DContextMonitorView = ({ textFieldRef }) => (
  <>
    <table></table>
    {/* <div id="monitor" ref={textAreaRef}></div> */}
    {/* <TextareaAutosize
      ref={textAreaRef}
      maxrows={4}
      aria-label="maximum height"
      placeholder="Maximum 4 rows"
      defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua." 
    /> */}
    <UXConsole textFieldRef={textFieldRef} />
  </>
);
Inertial3DContextMonitorView.propTypes = {
  textFieldRef: PropTypes.object,
};

export default Inertial3DContextMonitorView;
