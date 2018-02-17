import React from "react";
import ReactDOM from "react-dom";
import Icon from "./icon";

test("Icon should render correctly", () => {
  const icon = document.createElement("div");
  ReactDOM.render(<Icon />, icon);
});
