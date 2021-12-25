import React from "react";
import PropTypes from "prop-types";
import styles from "./styles";
import CardItemView from "./view";
import withStyles from "@material-ui/styles/withStyles";

const CardItem = (props) => {
  const { classes } = props;
  return <CardItemView classes={classes} />;
};

CardItem.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(CardItem);
