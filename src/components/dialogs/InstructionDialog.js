import React, { Component } from "react";
import PropTypes from "prop-types";

import { Link, withRouter } from "react-router-dom";
import withStyles from "@material-ui/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import BaseDialog from "./BaseDialog";

const styles = (theme) => ({
  container: {
    maxWidth: 600,
    flexGrow: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  bottomMargin: {
    marginBottom: theme.spacing(2),
  },
});

class InstructionDialog extends Component {
  render() {
    const { classes } = this.props;
    return (
      <BaseDialog {...this.props}>
        <div className={classes.bottomMargin}>
          <Typography variant="body2" gutterBottom>
            Make sure your phone meets the game requirements
          </Typography>
        </div>
        <Button
          component={Link}
          to="/walkthrough"
          className={classes.bottomMargin}
          variant="contained"
          onClick={this.handleClose}
          color="primary"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        >
          Getting started
        </Button>
        <Button
          component={Link}
          to="/walkthrough"
          variant="outlined"
          onClick={this.handleClose}
          color="primary"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        >
          Help
        </Button>
      </BaseDialog>
    );
  }
}
InstructionDialog.propTypes = {
  classes: PropTypes.object,
};

export default withRouter(withStyles(styles)(InstructionDialog));
