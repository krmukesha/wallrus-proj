import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { UXBox, UXPaper } from "../../../../components/theme";

const InfoUXBoxView = ({
  title,
  body,
  classes,
  buttonCallback,
  buttonLabel,
}) => (
  <Grid item xs={12} md={4}>
    <UXPaper>
      <UXBox>
        <Typography
          style={{ textTransform: "uppercase" }}
          color="secondary"
          gutterBottom
        >
          {`${title || "UXBox Title"}`}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {`${
            body ||
            "Sed sollicitudin vitae dui nec dapibus. Curabitur in magna elementum, tincidunt nibh eu, condimentum eros."
          }`}
        </Typography>
      </UXBox>
      <div className={classes.alignRight}>
        <Button
          color="primary"
          variant="contained"
          className={classes.actionButtom}
          onClick={() => buttonCallback && this.props.buttonCallback()}
        >
          {`${buttonLabel || "Learn more"}`}
        </Button>
      </div>
    </UXPaper>
  </Grid>
);
InfoUXBoxView.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  classes: PropTypes.object,
  buttonCallback: PropTypes.func,
  buttonLabel: PropTypes.string,
};

export default InfoUXBoxView;
