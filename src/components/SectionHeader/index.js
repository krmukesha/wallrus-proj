import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import SectionHeaderView from "./view";
import styles from "./styles";

const SectionHeader = (props) => {
  const { classes, title, subtitle } = props;
  return (
    <SectionHeaderView classes={classes} title={title} subtitle={subtitle} />
  );
};

SectionHeader.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default withRouter(withStyles(styles)(SectionHeader));
