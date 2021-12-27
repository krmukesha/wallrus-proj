import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import "../../../../assets/css/control.css";
import ControlsImgOne from "../../../../assets/images/controls-1.png";
import ControlsImgTwo from "../../../../assets/images/controls-2.png";
import UXButton from "../../../theme/components/UXButton";

const SignInStepView = ({ classes, handleNext }) => (
	<div className={classes.bigContainer}>
		<Paper className={classes.paper}>
			<div className="bg-home-3">
				<div className="p-5">
					<h2 className="text-white font-imperator font-size">
						REQUIREMENTS
						<br />& CONTROLS
					</h2>
					<div className="line"></div>
					<p className="p-t-b text-white font-circular">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua.
					</p>
					<img src={ControlsImgOne} alt="controlOne" className="img-story" />
					<p className="p-t-b text-white font-circular">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua.
					</p>
					<img src={ControlsImgTwo} alt="controlTwo" className="img-story" />
					<p className="p-t-b text-white font-circular mb-30">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua.
					</p>
					<UXButton
						onClick={(e) => handleNext(e)}
						size="large"
						className={`${classes.actionButtom} ${classes.startTestButton} ${classes.startbtn}`}
					>
						I Understand
					</UXButton>
				</div>
			</div>
		</Paper>
	</div>
);

SignInStepView.propTypes = {
	classes: PropTypes.object,
	handleNext: PropTypes.func,
};

export default SignInStepView;
