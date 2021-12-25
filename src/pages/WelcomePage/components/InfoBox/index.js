import React from "react";
import PropTypes from "prop-types";

import InfoBoxView from "./view";
import withStyles from "@material-ui/styles/withStyles";
import styles from "../../../../components/theme/styles";

const InfoBox = ({ classes, title, body }) => {
  return <InfoBoxView title={title} body={body} classes={classes} />;
};
InfoBox.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string,
  body: PropTypes.string,
};

export default withStyles(styles)(InfoBox);
