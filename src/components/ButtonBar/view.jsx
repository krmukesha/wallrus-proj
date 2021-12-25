import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

const ButtonBarView = ({ classes }) => (
  <div className={classes.spaceTop}>
    <Button className={classes.primary}>Delete</Button>
    <Button variant="contained" color="primary" className={classes.secondary}>
      Edit
    </Button>
  </div>
);

ButtonBarView.propTypes = {
  classes: PropTypes.object,
};

export default ButtonBarView;
