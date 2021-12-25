import React from "react";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiTypography-body1": {
      fontSize: 13,
    },
  },
}));
const TermsStepView = ({ classes, termsChecked, handleTerms }) => {
  const classess = useStyles();

  return (
    <div className={classes.bigContainer}>
      <Paper className={classes.paper}>
        <div style={{ marginBottom: 24 }}>
          <Typography
            variant="subtitle1"
            style={{
              fontWeight: "bold",
              color: "#fff",
              fontSize: "1.5rem",
              textTransform: " uppercase",
              fontFamily: "Imperator",
            }}
            gutterBottom
          >
            Terms & Conditions
          </Typography>
          <div className="line"></div>
        </div>
        <div
          style={{
            color: "#fff",
          }}
        >
          <Typography
            variant="subtitle1"
            style={{ fontWeight: "bold", color: "#fff", fontSize: "1.5rem" }}
            gutterBottom
          >
            1. Your agreement
          </Typography>
          <Typography style={{ color: "#fff" }} variant="body1" gutterBottom>
            By using this Site, you agree to be bound by, and to comply with,
            these Terms and Conditions. If you do not agree to these Terms and
            Conditions, please do not use this site. PLEASE NOTE: We reserve the
            right, at our sole discretion, to change, modify or otherwise alter
            these Terms and Conditions at any time. Unless otherwise indicated,
            amendments will become effective immediately. Please review these
            Terms and Conditions periodically. Your continued use of the Site
            following the posting of changes and/or modifications will
            constitute your acceptance of the revised Terms and Conditions and
            the reasonableness of these standards for notice of changes. For
            your information, this page was last updated as of the date at the
            top of these terms and conditions.
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ fontWeight: "bold", color: "#fff", fontSize: "1.5rem" }}
            gutterBottom
          >
            2. Privacy
          </Typography>
          <Typography variant="body1" gutterBottom>
            {`Please review our Privacy Policy, which also governs
          your visit to this Site, to understand our
          practices. By using this Site, you agree to be bound
          by, and to comply with, these Terms and Conditions.
          If you do not agree to these Terms and Conditions,
          please do not use this site. PLEASE NOTE: We reserve
          the right, at our sole discretion, to change, modify
          or otherwise alter these Terms and Conditions at any
          time. Unless otherwise indicated, amendments will
          become effective immediately. Please review these
          Terms and Conditions periodically. Your continued
          use of the Site following the posting of changes
          and/or modifications will constitute your acceptance
          of the revised Terms and Conditions and the
          reasonableness of these standards for notice of
          changes. For your information, this page was last
          updated as of the date at the top of these terms and
          conditions.`}
          </Typography>
        </div>
        <FormGroup row>
          <FormControlLabel
            style={{ color: "#fff", fontSize: "13px" }}
            control={
              <Checkbox
                style={{ color: "#fff", paddind: "0" }}
                checked={termsChecked}
                onChange={handleTerms}
                value="check"
              />
            }
            label="I have read and understood the terms & conditions"
            className={`${classess.root}`}
          />
        </FormGroup>
      </Paper>
    </div>
  );
};
TermsStepView.propTypes = {
  classes: PropTypes.object,
  termsChecked: PropTypes.bool,
  handleTerms: PropTypes.func,
};

export default TermsStepView;
