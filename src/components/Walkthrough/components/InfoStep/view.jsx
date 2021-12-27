import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const InfoStepView = ({ classes }) => (
	<div className={classes.bigContainer}>
		<Paper className={classes.paper}>
			<div className={classes.topInfo}>
				<div>
					<Typography
						variant="subtitle1"
						style={{ fontWeight: "bold" }}
						gutterBottom
					>
						Information
					</Typography>
					<Typography variant="body1" gutterBottom>
						General information about the service here
					</Typography>
				</div>
				<div>
					<Button
						variant="outlined"
						size="large"
						className={classes.outlinedButtom}
					>
						Edit
					</Button>
				</div>
			</div>
			<Grid item container xs={12}>
				<Grid item xs={6}>
					<Typography
						style={{ textTransform: "uppercase" }}
						color="secondary"
						gutterBottom
					>
						User
					</Typography>
					<Typography variant="h5" gutterBottom>
						John Doe
					</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography
						style={{ textTransform: "uppercase" }}
						color="secondary"
						gutterBottom
					>
						City
					</Typography>
					<Typography variant="h5" gutterBottom>
						Tokyo
					</Typography>
				</Grid>
			</Grid>
		</Paper>
	</div>
);

InfoStepView.propTypes = {
	classes: PropTypes.object,
};

export default InfoStepView;
