import Koa from "koa";
import bodyparser from "koa-bodyparser";

import router from "./router";
import { getConnection, runMigrations } from "./db";
import logger from "./logger";

export function init(app: Koa): void {
  getConnection()
    .then(db => {
      return runMigrations(db);
    })
    .catch(err => {
      logger.error("Error running migrations on start", err);
      process.exit(1);
    });

  app.use(bodyparser());
  app.use(router.routes());
}
