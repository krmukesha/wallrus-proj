import React from "react";
import PropTypes from "prop-types";

import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DoneIcon from "@material-ui/icons/Done";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import BackButton from "../../components/BackButton";

import logo from "../../components/theme/images/logo.svg";

const SignUpPageView = ({
  classes,
  activeStep,
  steps,
  loading,
  receivingAccount,
  handleBack,
  handleNext,
  handleChange,
  labelWidth,
  stepActions,
}) => (
  <>
    <CssBaseline />
    <div className={classes.root}>
      <BackButton />
      <Grid container justify="center">
        <Grid
          spacing={10}
          alignItems="center"
          justify="center"
          container
          className={classes.grid}
        >
          <Grid item xs={12}>
            <div className={classes.logo}>
              <img width={100} height={100} src={logo} alt="" />
            </div>
            <div className={classes.stepContainer}>
              <div className={classes.stepGrid}>
                <Stepper
                  classes={{ root: classes.stepper }}
                  activeStep={activeStep}
                  alternativeLabel
                >
                  {steps.map((label) => {
                    return (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </div>
              {activeStep === 0 && (
                <div className={classes.smallContainer}>
                  <Paper className={classes.paper}>
                    <div>
                      <div style={{ marginBottom: 32 }}>
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: "bold" }}
                          gutterBottom
                        >
                          Select
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          A item to select
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          style={{
                            textTransform: "uppercase",
                            marginBottom: 20,
                          }}
                          color="secondary"
                          gutterBottom
                        >
                          First options
                        </Typography>
                        <FormControl
                          variant="outlined"
                          className={classes.formControl}
                        >
                          <Select
                            value={receivingAccount}
                            onChange={handleChange}
                            input={
                              <OutlinedInput
                                labelWidth={labelWidth}
                                name="receivingAccount"
                              />
                            }
                          >
                            <MenuItem value="">
                              <em>Select some option</em>
                            </MenuItem>
                            <MenuItem value={"first"}>Option 1</MenuItem>
                            <MenuItem value={"second"}>Other option</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </Paper>
                </div>
              )}
              {activeStep === 1 && (
                <div className={classes.smallContainer}>
                  <Paper className={classes.paper}>
                    <Grid item container xs={12}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Sign & confirm
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Sign and confirm loan agreement
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          One text to explain that
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              )}
              {activeStep === 2 && (
                <div className={classes.smallContainer}>
                  <Paper className={classes.paper}>
                    <div>
                      <div style={{ marginBottom: 32 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Permissions
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          We need some permissions to proceed.
                        </Typography>
                      </div>
                      <div>
                        <Typography color="secondary" gutterBottom>
                          Accounts
                        </Typography>
                        <List component="nav">
                          <ListItem>
                            <ListItemIcon>
                              <DoneIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="0297 00988200918" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <DoneIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="0297 00988200920" />
                          </ListItem>
                        </List>
                      </div>
                    </div>
                  </Paper>
                </div>
              )}
              {activeStep === 3 && (
                <div className={classes.bigContainer}>
                  <Paper className={classes.paper}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={{ width: 380, textAlign: "center" }}>
                        <div style={{ marginBottom: 32 }}>
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                            gutterBottom
                          >
                            Collecting your data
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            We are processing your request
                          </Typography>
                        </div>
                        <div>
                          <Fade
                            in={loading}
                            style={{
                              transitionDelay: loading ? "800ms" : "0ms",
                            }}
                            unmountOnExit
                          >
                            <CircularProgress
                              style={{
                                marginBottom: 32,
                                width: 100,
                                height: 100,
                              }}
                            />
                          </Fade>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </div>
              )}
              {activeStep !== 3 && (
                <div className={classes.buttonBar}>
                  {activeStep !== 2 ? (
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                      size="large"
                    >
                      Back
                    </Button>
                  ) : (
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                      size="large"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    size="large"
                    style={
                      receivingAccount.length
                        ? { background: classes.button, color: "white" }
                        : {}
                    }
                    disabled={!receivingAccount.length}
                  >
                    {stepActions()}
                  </Button>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  </>
);
SignUpPageView.propTypes = {
  classes: PropTypes.object,
  activeStep: PropTypes.number,
  steps: PropTypes.number,
  loading: PropTypes.bool,
  receivingAccount: PropTypes.object,
  handleBack: PropTypes.func,
  handleNext: PropTypes.func,
  handleChange: PropTypes.func,
  labelWidth: PropTypes.number,
  stepActions: PropTypes.func,
};

export default SignUpPageView;
