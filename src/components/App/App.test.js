import React from "react";
import ReactDOM from "react-dom";
import App from "./";

it("renders without crashing", () => {
  window.scrollTo = jest.fn();

  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
