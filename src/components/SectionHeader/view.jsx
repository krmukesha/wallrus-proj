import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const SectionHeaderView = ({ classes, title, subtitle }) => (
  <div className={classes.sectionContainer}>
    <Typography variant="subtitle1" className={classes.title}>
      {title}
    </Typography>
    <Typography variant="body1" gutterBottom>
      {subtitle}
    </Typography>
  </div>
);

SectionHeaderView.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default SectionHeaderView;
