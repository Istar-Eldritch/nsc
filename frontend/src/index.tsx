import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Landing, DevDocs, SignIn } from "./pages";

function Router(): ReactElement {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Landing} />
      <Route path="/dev-docs" component={DevDocs} />
      <Route path="/auth/signin" component={SignIn} />
    </BrowserRouter>
  );
}

ReactDOM.render(<Router />, document.getElementById("app"));
