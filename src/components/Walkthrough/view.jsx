/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Step from "@material-ui/core/Step";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import StepLabel from "@material-ui/core/StepLabel";
import CssBaseline from "@material-ui/core/CssBaseline";

// import BackButton from "../BackButton";

import {
	DoneStep,
	SysRequirementsStep,
	TermsStep,
	SignInStep,
	PermissionsStep,
	PedestalSetupStep,
} from "./components";

const WalkthroughView = ({
	classes,
	activeStep,
	steps,
	termsChecked,
	handleTerms,
	handleBack,
	handleNext,
	goToDashboard,
	goToGamePlayerPage,
	stepActions,
	permissionsGranted,
	handlePermissionsGranted,
	handleNoButton,
	noButtonStatus,
	speedTestResults,
	handleSpeedTestResults,
	isNextButtonDisabled,
}) => {
	useEffect(() => {
		console.log("Log", noButtonStatus);
	}, [noButtonStatus]);

	return (
		<>
			<CssBaseline />
			<div className={classes.root}>
				<Grid container justify="center">
					<Grid
						spacing={12}
						alignItems="center"
						justify="center"
						container
						className={classes.grid}
					>
						<Grid item xs={12}>
							{/* Edit container above to have padding: 0px 40px 40px 40px */}
							<div className="background-images">
								<div className={classes.stepContainer}>
									<div className={classes.bigContainer}>
										{/* <Stepper
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
                </Stepper> */}
									</div>

									{activeStep === 0 && (
										<SysRequirementsStep
											classes={classes}
											speedTestResults={speedTestResults}
											handleSpeedTestResults={handleSpeedTestResults}
										/>
									)}

									{activeStep === 1 && (
										<TermsStep
											classes={classes}
											termsChecked={termsChecked}
											handleTerms={handleTerms}
										/>
									)}

									{activeStep === 3 && (
										<SignInStep classes={classes} handleNext={handleNext} />
									)}

									{activeStep === 4 && (
										<PermissionsStep
											classes={classes}
											permissionsGranted={permissionsGranted}
											handlePermissionsGranted={handlePermissionsGranted}
											handleNoButton={handleNoButton}
											noButtonStatus={noButtonStatus}
											isNextButtonDisabled={isNextButtonDisabled}
										/>
									)}

									{activeStep === 5 && (
										<PedestalSetupStep
											classes={classes}
											handleNext={handleNext}
											onHandleClose={handleBackbtn}
										/>
									)}

									{(activeStep === 6 || activeStep === 7) && (
										<DoneStep
											classes={classes}
											goToGamePlayerPage={goToGamePlayerPage}
										/>
									)}

									<div className={classes.flexBar}>
										{activeStep !== 6 && !noButtonStatus && (
											<Button
												disabled={activeStep === 0}
												onClick={handleBack}
												className={classes.backButton}
												size="large"
											>
												Back
											</Button>
										)}
										{activeStep !== 2 && activeStep !== 6 && !noButtonStatus && (
											<Button
												variant="contained"
												color="primary"
												onClick={activeStep !== 6 ? handleNext : goToDashboard}
												size="large"
												disabled={isNextButtonDisabled()}
											>
												{stepActions()}
											</Button>
										)}
									</div>
								</div>
							</div>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</>
	);
};
WalkthroughView.propTypes = {
	classes: PropTypes.object,
	activeStep: PropTypes.number,
	steps: PropTypes.array,
	termsChecked: PropTypes.bool,
	handleTerms: PropTypes.func,
	handleBack: PropTypes.func,
	handleNext: PropTypes.func,
	goToDashboard: PropTypes.func,
	goToGamePlayerPage: PropTypes.func,
	stepActions: PropTypes.func,
	permissionsGranted: PropTypes.bool,
	handlePermissionsGranted: PropTypes.func,
	speedTestResults: PropTypes.object,
	handleSpeedTestResults: PropTypes.func,
	isNextButtonDisabled: PropTypes.func,
	handleBackbtn: PropTypes.func,
	isNextButtonDisabled: PropTypes.bool,
	noButtonStatus: PropTypes.bool,
	handleNoButton: PropTypes.func,
};

export default WalkthroughView;
