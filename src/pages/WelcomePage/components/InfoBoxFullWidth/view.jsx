import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { UXBox, UXPaper } from "../../../../components/theme";

const InfoBoxFullWidthView = ({
	classes,
	title,
	button1Label,
	button1Callback,
	button2Label,
	button2Callback,
	isMobileWidth,
	children,
}) => (
	<Grid container item xs={12}>
		<Grid item xs={12}>
			<UXPaper>
				<Container disableGutters={true} maxWidth="sm">
					<UXBox size={"lg"}>
						<Typography
							color="secondary"
							style={{
								textAlign: "center",

								marginTop: "6rem",
								fontSize: "1.5rem",
								paddingBottom: "0",
							}}
							gutterBottom
						>
							{`${title || "InfoBoxFullWidth Title"}`}
						</Typography>
						<Typography
							variant="body1"
							style={{ textAlign: "center", width: "100%" }}
							gutterBottom
						>
							{children}
						</Typography>
					</UXBox>
					<UXBox className={classes.alignCenter}>
						<Button
							onClick={() => button1Callback && button1Callback()}
							variant="outlined"
							className={`${classes.actionButtom} ${
								isMobileWidth ? classes.fullWidth : ""
							}`}
							fullWidth={isMobileWidth}
						>
							{`${button1Label || "Learn more"}`}
						</Button>
						<Button
							onClick={() => button2Callback && button2Callback()}
							color="primary"
							variant="contained"
							className={`${classes.actionButtom} ${
								isMobileWidth ? classes.fullWidth : ""
							}`}
							fullWidth={isMobileWidth}
						>
							{`${button2Label || "Learn more"}`}
						</Button>
					</UXBox>
				</Container>
			</UXPaper>
		</Grid>
	</Grid>
);
InfoBoxFullWidthView.propTypes = {
	classes: PropTypes.object,
	title: PropTypes.string,
	button1Label: PropTypes.string,
	button1Callback: PropTypes.func,
	button2Label: PropTypes.string,
	button2Callback: PropTypes.func,
	isMobileWidth: PropTypes.bool,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default InfoBoxFullWidthView;
