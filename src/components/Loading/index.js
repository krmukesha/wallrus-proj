import React from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/styles/withStyles";
import styles from "./styles";
import LoadingView from "./view";

const Loading = (props) => {
  const { classes, loading } = props;
  return <LoadingView classes={classes} loading={loading} />;
};
Loading.propTypes = {
  classes: PropTypes.object,
  loading: PropTypes.bool,
};

export default withStyles(styles)(Loading);
