import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import DescriptionIcon from "@material-ui/icons/Description";
import ButtonBar from "../ButtonBar";

const CardItemView = ({ classes }) => (
  <div className={classes.root}>
    <Paper className={classes.paper}>
      <div className={classes.itemContainer}>
        <div className={classes.avatarContainer}>
          <Avatar className={classes.avatar}>
            <DescriptionIcon />
          </Avatar>
        </div>
        <div className={classes.baseline}>
          <div className={classes.inline}>
            <Typography
              style={{ textTransform: "uppercase" }}
              color="secondary"
              gutterBottom
            >
              Months
            </Typography>
            <Typography variant="h6" gutterBottom>
              4 month(s)
            </Typography>
          </div>
          <div className={classes.inline}>
            <Typography
              style={{ textTransform: "uppercase" }}
              color="secondary"
              gutterBottom
            >
              Creation date
            </Typography>
            <Typography variant="h6" gutterBottom>
              01 February 2019
            </Typography>
          </div>
          <div className={classes.inline}>
            <Typography
              style={{ textTransform: "uppercase" }}
              color="secondary"
              gutterBottom
            >
              Amount
            </Typography>
            <Typography variant="h6" gutterBottom>
              6,600 USD
            </Typography>
          </div>
        </div>
        <div className={classes.inlineRight}>
          <Typography
            style={{ textTransform: "uppercase" }}
            color="secondary"
            gutterBottom
          >
            Other Amount
          </Typography>
          <Typography variant="h4" gutterBottom>
            Once a month
          </Typography>
          <ButtonBar />
        </div>
      </div>
    </Paper>
  </div>
);

CardItemView.propTypes = {
  classes: PropTypes.object,
};

export default CardItemView;
