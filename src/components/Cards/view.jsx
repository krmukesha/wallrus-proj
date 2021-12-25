import React from "react";
import PropTypes from "prop-types";

import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import CardItem from "../CardItem";
import Topbar from "../Topbar";
import SectionHeader from "../SectionHeader";

const CardsView = ({ classes, currentPath }) => (
  <>
    <CssBaseline />
    <Topbar currentPath={currentPath} />
    <div className={classes.root}>
      <Grid container justify="center">
        <Grid
          spacing={10}
          alignItems="center"
          justify="center"
          container
          className={classes.grid}
        >
          <Grid item xs={12}>
            <SectionHeader
              title="Cards"
              subtitle="One page with a list of a collection"
            />
            <CardItem />
          </Grid>
        </Grid>
      </Grid>
    </div>
  </>
);

CardsView.propTypes = {
  classes: PropTypes.object,
  currentPath: PropTypes.string,
};

export default CardsView;
