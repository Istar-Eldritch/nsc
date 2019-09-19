import React from "react";
import { Switch, Route, RouteProps } from "react-router";
import { hot } from "react-hot-loader";
// import asyncComponent from "./components/async";
import {StaticContext} from "./server/types";

// Cannot be async as it's used in `<Status>` component
import {NotFound, SignIn, Landing} from "./pages";

export interface AppRoute {
  path: string;
  exact?: boolean;
  component: RouteProps["component"] & { fetchData?: Function };
  render?: RouteProps["render"];
  sitemap: { show: boolean; priority?: number };
}

export const appRoutes: AppRoute[] = [
  { path: "/auth/signin", component: SignIn, sitemap: { show: true, priority: 0.8 } },
  { path: "/", exact: true, component: Landing, sitemap: { show: true, priority: 1.0 } },
  //{ path: "/sitemap.xml", exact: true, component: Sitemap, sitemap: { show: false } },

];

function Status({ code, children }: { code: number; children: React.ReactNode }) {
  return (
    <Route
      render={({ staticContext }: { staticContext?: StaticContext }) => {
        if (staticContext) {
          staticContext.status = code;
        }

        return children;
      }}
    />
  );
}

const App = ({ routes = appRoutes }: { routes?: AppRoute[] }) => (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}

      <Status code={404}>
        <NotFound />
      </Status>
    </Switch>
);

export default hot(module)(App);
