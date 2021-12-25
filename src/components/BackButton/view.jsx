import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

const BackButtonView = ({ classes }) => (
  <div>
    <Typography variant="h6" gutterBottom>
      <Link className={classes.link} to={{ pathname: "/" }}>
        <KeyboardArrowLeft />
        <span className={classes.text}>Back to Landing Page</span>
      </Link>
    </Typography>
  </div>
);

BackButtonView.propTypes = {
  classes: PropTypes.object,
};
export default BackButtonView;
