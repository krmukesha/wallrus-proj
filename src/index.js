import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components";
import * as serviceWorker from "./services/serviceWorker";
// import * as speedTestSW from './services/speedtest_worker';
import "./services/adapter-latest";

console.log(process.env);
console.log("LVSDM Client APP - Development Env");

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
  document.getElementById("root"),
);

serviceWorker.register();
