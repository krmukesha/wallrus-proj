import React from "react";
import PropTypes from "prop-types";

import InfoBoxFullWidthView from "./view";
import withStyles from "@material-ui/styles/withStyles";
import styles from "../../../../components/theme/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const InfoBoxFullWidth = ({
	classes,
	title,
	button1Label,
	// button1Callback,
	button2Label,
	button2Callback,
	children,
}) => {
	const isMobileWidth = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	return (
		<InfoBoxFullWidthView
			classes={classes}
			title={title}
			button1Label={button1Label}
			// button1Callback={button1Callback}
			button2Label={button2Label}
			button2Callback={button2Callback}
			isMobileWidth={isMobileWidth}
		>
			{children}
		</InfoBoxFullWidthView>
	);
};
InfoBoxFullWidth.propTypes = {
	classes: PropTypes.object,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	title: PropTypes.string,
	button1Label: PropTypes.string,
	// button1Callback: PropTypes.func,
	button2Label: PropTypes.string,
	button2Callback: PropTypes.func,
};

export default withStyles(styles)(InfoBoxFullWidth);
