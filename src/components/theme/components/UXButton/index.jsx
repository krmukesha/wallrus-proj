import React from "react";
import PropTypes from "prop-types";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/styles/withStyles";
import styles from "../../styles";

const UXButton = ({
	fullWidthBreakpoints,
	classes,
	onClick,
	children,
	className,
}) => {
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	return (
		<Button
			onClick={onClick}
			color="primary"
			variant="contained"
			// className={classes.actionButton}
			className={`${className ? className : classes.actionButtom} ${
				matches ? classes.fullWidth : ""
			}`}
			fullWidth={fullWidthBreakpoints && matches}
		>
			{children}
		</Button>
	);
};
UXButton.propTypes = {
	fullWidthBreakpoints: PropTypes.bool,
	classes: PropTypes.object,
	onClick: PropTypes.func,
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	className: PropTypes.string,
};

export default withStyles(styles)(UXButton);
