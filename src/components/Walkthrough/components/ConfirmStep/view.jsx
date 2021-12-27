import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const ConfirmStepView = ({ classes }) => (
	<div className={classes.smallContainer}>
		<Paper className={classes.paper}>
			<Grid item container xs={12}>
				<Grid item xs={12}>
					<Typography
						variant="subtitle1"
						style={{ fontWeight: "bold" }}
						gutterBottom
					>
						Sign & confirm
					</Typography>
					<Typography variant="body1" gutterBottom>
						Sign and confirm your agreement
					</Typography>
				</Grid>
			</Grid>
		</Paper>
	</div>
);

ConfirmStepView.propTypes = {
	classes: PropTypes.object,
};

export default ConfirmStepView;
