// const backgroundShape = require("../theme/images/shape.svg");
import backgroundShape from "../theme/images/shape.svg";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["A500"],
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 20,
    padding: 20,
    paddingBottom: 200,
  },
  grid: {
    width: 1000,
  },
});
export default styles;
