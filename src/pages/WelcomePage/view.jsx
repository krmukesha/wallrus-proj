import React from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
// import { Topbar } from "../../components";
import bird from "../../assets/images/Bitmap-2.png";
import { InfoBoxFullWidth } from "./components";
import withStyles from "@material-ui/styles/withStyles";
import styles from "../../components/theme/styles";

const WelcomePageView = ({
	children,
	classes,

	openGetStartedDialog,
}) => {
	return (
		<>
			<CssBaseline />
			{/* <Topbar /> */}
			<div className={classes.root}>
				<Grid container justify="center">
					<Grid
						spacing={4}
						alignItems="center"
						justify="center"
						container
						className={classes.grid}
					>
						<div className="background-image">
							<div className="top-images"></div>
							<InfoBoxFullWidth
								title={"Welcome to Wallrus"}
								button1Label={"ABOUT THE MONSTERS WORLD"}
								// button1Callback={() => openDialog()}
								button2Label={"START THE EXPERIENCE"}
								button2Callback={() => openGetStartedDialog()}
								className="custom-info-box"
							>
								<h2 className="home-text">THE SECRET LIFE OF MONSTERS</h2>
								<div className="line"></div>
								<p className="font-circular" style={{ padding: "10px" }}>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
								</p>
							</InfoBoxFullWidth>
							<div className="footer-home">
								<img className="width-custom" src={bird} alt="images" />
							</div>
						</div>
					</Grid>
				</Grid>
				{children}
			</div>
		</>
	);
};
WelcomePageView.propTypes = {
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	classes: PropTypes.object,
	// openDialog: PropTypes.func,
	openGetStartedDialog: PropTypes.func,
};

export default withStyles(styles)(WelcomePageView);
