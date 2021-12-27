import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const DoneStepView = ({ classes, onClick }) => (
	<div className={classes.smallContainer}>
		<Paper className={classes.paper}>
			<Grid item container xs={12}>
				<Grid item xs={12}>
					<Typography variant="subtitle1" gutterBottom>
						Congratulations{" "}
						<span role="img" aria-label="conrats emoji">
							🎉
						</span>
					</Typography>
					<Typography variant="body1" gutterBottom>
						{`You have now access to see the monster's dimension.`}
					</Typography>
					<Button
						fullWidth
						variant="outlined"
						color="primary"
						size="large"
						className={classes.startGameButton}
						onClick={onClick}
					>
						Start the game
					</Button>
				</Grid>
			</Grid>
		</Paper>
	</div>
);

DoneStepView.propTypes = {
	classes: PropTypes.object,
	onClick: PropTypes.func,
};

export default DoneStepView;
