import Koa from "koa";
import staticCache from "koa-static-cache";
import path from "path";
import { init } from "./app";
import * as config from "config";

const app = new Koa();

app.use(
  staticCache(path.resolve(__dirname, "../assets"), {
    maxAge: 365 * 24 * 60 * 60,
    buffer: true,
    prefix: "/assets",
    dynamic: false
  })
);

init(app);

app.listen(config.get<number>("port"));
