import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const PedestalSetupStepView = ({ classes }) => (
	<div className={classes.bigContainer}>
		<Paper className={classes.paper}>
			<div className={classes.topInfo}>
				<div>
					<Typography
						variant="subtitle1"
						style={{ fontWeight: "bold" }}
						gutterBottom
					>
						Instructions
					</Typography>
					<Typography variant="body1" gutterBottom>
						{`Please put your phone in the pedestal to load the Monster's visor.`}
					</Typography>
				</div>
			</div>
			<Grid item container xs={12}></Grid>
		</Paper>
	</div>
);

PedestalSetupStepView.propTypes = {
	classes: PropTypes.object,
};

export default PedestalSetupStepView;
