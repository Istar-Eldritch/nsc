import { addHook } from "pirates";
import { Configuration } from "webpack";
import {init} from "./app";

// Convert image file imports into empty strings
addHook(() => "", {
  exts: [".jpg", ".jpeg", ".png", ".gif", ".png", ".svg"],
  matcher: () => true,
});

import Koa from "koa";
import koaWebpack from "koa-webpack";
import Webpack from "webpack";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig: Configuration[] = require("../../webpack.config.js");
import logger from "./logger";

const app = new Koa();

const compiler = Webpack(webpackConfig.find((c) => c.name === "browser"));

const port = parseInt(process.env.PORT || "3000", 10);

koaWebpack({
  compiler,
  devMiddleware: {
    serverSideRender: true,
    publicPath: "/assets/",
  },
  hotClient: {
    port: port + 1,
  },
}).then((middleware: any) => {
  app.use(middleware);
	init(app);

  logger.info("serverStarted", { port });

  app.listen(port);
});
