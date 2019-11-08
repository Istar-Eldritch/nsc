import { addHook } from "pirates";
import Webpack, { Configuration } from "webpack";
import { init } from "./app";
import config from "config";

import Koa from "koa";
import koaWebpack from "koa-webpack";

import logger from "./logger";

// Convert image file imports into empty strings
addHook(() => "", {
  exts: [".jpg", ".jpeg", ".png", ".gif", ".png", ".svg"],
  matcher: () => true
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig: Configuration[] = require("../../webpack.config.js");

const app = new Koa();

const compiler = Webpack(webpackConfig.find(c => c.name === "browser"));

const port = config.get<number>("port");

koaWebpack({
  compiler,
  devMiddleware: {
    serverSideRender: true,
    publicPath: "/assets/"
  },
  hotClient: {
    port: port + 1
  }
}).then((middleware: any) => {
  app.use(middleware);
  init(app);

  logger.info("serverStarted", { port });

  app.listen(port);
});
