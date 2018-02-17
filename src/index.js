import React from "react";
import { render } from "react-snapshot";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import App from "./containers/App";
import registerServiceWorker from "./registerServiceWorker";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
