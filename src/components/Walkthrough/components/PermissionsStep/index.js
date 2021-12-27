import React, { useEffect } from "react";
import PropTypes from "prop-types";
import PermissionsStepView from "./view";

import { usePermissions } from "../../../../hooks";

const PermissionsStep = ({
	classes,
	permissionsGranted,
	handlePermissionsGranted,
	handleNoButton,
}) => {
	const {
		requestCameraPermissions,
		requestDeviceMotionPermissions,
		requestDeviceOrientationPermissions,
	} = usePermissions();

	useEffect(() => {
		requestCameraPermissions();
		requestDeviceMotionPermissions();
		requestDeviceOrientationPermissions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<PermissionsStepView
			classes={classes}
			permissionsGranted={permissionsGranted}
			handlePermissionsGranted={handlePermissionsGranted}
			handleNoButton={handleNoButton}
		/>
	);
};

PermissionsStep.propTypes = {
	classes: PropTypes.object,
	permissionsGranted: PropTypes.bool,
	handlePermissionsGranted: PropTypes.func,
	handleNoButton: PropTypes.func,
};

export default PermissionsStep;
