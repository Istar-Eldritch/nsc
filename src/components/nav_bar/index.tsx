import React, { ReactElement } from "react";
import { Profile } from "./profile";
import { Link } from "react-router-dom";
import { None } from "funfix";

export * from "./drop_down_menu";

export function NavBar(): ReactElement {
  return (
    <nav className="shadow">
      <div
        className="relative container p-3 mx-auto text-gray-900 flex items-baseline"
        role="navigation"
      >
        <Link to="/">
          <h1 className="text-4xl font-fold">NSC</h1>
        </Link>
        <div className="mx-auto"></div>
        <Profile className="ml-6 text-lg" data={None} />
      </div>
    </nav>
  );
}
