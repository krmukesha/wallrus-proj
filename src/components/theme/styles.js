// const backgroundShape = require("./images/shape.svg");
// import backgroundShape from "./images/shape.svg";

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.grey["100"],
		overflow: "hidden",
		// background: `url(${backgroundShape}) no-repeat`,
		backgroundSize: "cover",
		backgroundPosition: "0 400px",
		paddingBottom: 0,
	},
	grid: {
		width: 480,
		// marginTop: 40,
		[theme.breakpoints.down("sm")]: {
			width: "calc(100% - 0px)",
			margn: "0px",
		},
	},
	paper: {
		padding: theme.spacing(3),
		textAlign: "left",
		color: theme.palette.text.secondary,
	},
	rangeLabel: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop: theme.spacing(2),
	},
	topBar: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 32,
	},
	outlinedButtom: {
		textTransform: "uppercase",
		margin: theme.spacing(1),
	},
	actionButtom: {
		textTransform: "uppercase",
		cursor: "pointer",
		backgroundColor: "#191919",
		height: "60px",
		width: "100%",
		color: "#fff",
		margin: "8px 0",
		padding: "10px",
		borderRadius: " 30px",
		fontSize: "1.1rem",
		border: "0",
	},
	blockCenter: {
		padding: theme.spacing(2),
		textAlign: "center",
	},
	block: {
		padding: theme.spacing(2),
	},
	shortBox: {
		marginBottom: 40,
		height: 65,
	},
	box: {
		marginBottom: 40,
	},
	inlining: {
		display: "inline-block",
		marginRight: 10,
	},
	buttonBar: {
		display: "flex",
	},
	alignCenter: {
		display: "flex",
		justifyContent: "center",
		textAlign: "center",
		flexDirection: "column",
	},
	alignRight: {
		display: "flex",
		justifyContent: "flex-end",
	},
	noBorder: {
		borderBottomStyle: "hidden",
	},
	loadingState: {
		opacity: 0.05,
	},
	loadingMessage: {
		position: "absolute",
		top: "40%",
		left: "40%",
	},
	uxConsoleWrapper: {
		// color: theme.palette.grey["100"],
	},
	uxConsole: {
		color: theme.palette.grey["100"],
		fontSize: "0.45em",
		lineHeight: "1.4em",
		fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
	},
	fullWidth: {
		width: "100%",
	},
	//  Gauges
	gaugeGridItem: {},
	gaugeGroupContainer: {
		justifyContent: "center",
	},
	gaugeItemContainer: {
		paddingLeft: "1em",
		paddingRight: "1em",
	},
	boolGaugeLabel: {
		color: theme.palette.grey["100"], // White
		lineHeight: "1.4em",
		fontWeight: "normal",
		letterSpacing: "0px",
		fontSize: "0.75em",
	},
	numberGaugeLabel: {
		color: theme.palette.grey["100"], // White
		lineHeight: "1.4em",
		fontWeight: "normal",
		letterSpacing: "0px",
		fontSize: "0.75em",
		textAlign: "center",
	},
	numberGaugeValue: {
		color: theme.palette.grey["100"], // White
		lineHeight: "1.4em",
		fontWeight: "normal",
		letterSpacing: "0px",
		textAlign: "center",
	},
});
export default styles;
