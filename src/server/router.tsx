import React from "react";
import Router from "koa-router";
import { Context } from "koa";
import ReactDOMServer from "react-dom/server";
import { StaticRouter, matchPath } from "react-router";
import App, { AppRoute, appRoutes } from "../app";
import { StaticContext } from "./types";
import Container from "./container";
import logger from "./logger";

const basePath = process.env.BASE_PATH || "";

const router = new Router().prefix(basePath);

// Resolve dynamic imports
const routeResolvers: Promise<AppRoute>[] = appRoutes.map((route: any) => {
  logger.info("Route", route);
  return typeof route.component.then === "function"
    ? route.component.then(
        (resolved: any): AppRoute => {
          return {
            ...route,
            component: resolved.default
          };
        }
      )
    : route;
});

router.get("/sitemap.xml", async ctx => {
  const dataFetches: {}[] = [];

  const resolvedRoutes: AppRoute[] = await Promise.all(routeResolvers);

  resolvedRoutes.some((route: AppRoute): boolean => {
    const match = matchPath(ctx.request.path, route);

    return !!match;
  });

  await Promise.all(dataFetches);

  //  const page = ReactDOMServer.renderToStaticMarkup(
  //    <StaticRouter location={ctx.request.url} context={{}}>
  //    </StaticRouter>,
  //  );

  ctx.type = "application/xml";
  //  ctx.body = page;
});

router.get("*", async (ctx: Context) => {
  logger.info("Get *");
  const dataFetches: {}[] = [];

  const resolvedRoutes: AppRoute[] = await Promise.all(routeResolvers);

  resolvedRoutes.some((route: AppRoute): boolean => {
    const match = matchPath(ctx.request.path, route);
    return !!match;
  });

  await Promise.all(dataFetches);

  const context: StaticContext = {};

  const page = ReactDOMServer.renderToString(
    <StaticRouter basename={""} location={ctx.request.url} context={context}>
      <App routes={resolvedRoutes} />
    </StaticRouter>
  );

  const markup = ReactDOMServer.renderToString(<Container>{page}</Container>);

  if (context.status) {
    ctx.status = context.status;
  }

  ctx.body = markup;
});

export default router;
