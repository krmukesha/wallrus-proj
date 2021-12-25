import React from "react";
import PropTypes from "prop-types";
import DoneMessageView from "./view";

const DoneMessage = ({ messageTxt, id = "", classes = "" }) => {
  return (
    <DoneMessageView id={id} className={classes}>
      {messageTxt}
    </DoneMessageView>
  );
};

DoneMessage.propTypes = {
  messageTxt: PropTypes.string,
  id: PropTypes.string,
  classes: PropTypes.object,
};
export default DoneMessage;
