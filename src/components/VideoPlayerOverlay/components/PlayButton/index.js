import React from "react";
import PropTypes from "prop-types";
import PlayButtonView from "./view";

const PlayButton = ({
  id = "playButton",
  classes = "",
  onClickCallback = () => {},
  labelTxt = "",
}) => {
  return (
    <PlayButtonView
      id={id}
      className={classes}
      onClick={() => onClickCallback()}
    >
      {labelTxt}
    </PlayButtonView>
  );
};

PlayButton.propTypes = {
  id: PropTypes.string,
  classes: PropTypes.object,
  onClickCallback: PropTypes.func,
  labelTxt: PropTypes.string,
};

export default PlayButton;
