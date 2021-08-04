import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import configureStore from "./app/configureStore";
import { msalClient } from "./app/msalClient";
import {Provider as ReduxProvider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import { MsalProvider } from "@azure/msal-react";

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <MsalProvider instance={msalClient}>
        <App />
      </MsalProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
