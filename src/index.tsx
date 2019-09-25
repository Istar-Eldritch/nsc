import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app";

import "./styles.css";

function Router(): ReactElement {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

ReactDOM.render(<Router />, document.getElementById("app"));
