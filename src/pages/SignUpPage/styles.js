// const backgroundShape = require("../../components/theme/images/shape.svg");
import backgroundShape from "../../components/theme/images/shape.svg";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary["A100"],
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 10,
    padding: 20,
    paddingBottom: 500,
  },
  grid: {
    margin: `0 ${theme.spacing(2)}px`,
  },
  smallContainer: {
    width: "60%",
  },
  bigContainer: {
    width: "80%",
  },
  logo: {
    marginBottom: 24,
    display: "flex",
    justifyContent: "center",
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stepGrid: {
    width: "80%",
  },
  buttonBar: {
    marginTop: 32,
    display: "flex",
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.palette.primary["A100"],
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1),
  },
  stepper: {
    backgroundColor: "transparent",
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
  topInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42,
  },
  formControl: {
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

export default styles;
