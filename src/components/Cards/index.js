import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/styles";
import CardsView from "./view";
import styles from "./styles";

const Cards = (props) => {
  const { classes } = props;
  return <CardsView classes={classes} />;
};

Cards.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Cards);
