import Koa from "koa";
import bodyparser from "koa-bodyparser";

import router from "./router";

export function init(app: Koa): void {
  app.use(bodyparser());
  app.use(router.routes());
}
