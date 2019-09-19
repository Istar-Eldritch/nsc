import Koa from "koa";
import staticCache from "koa-static-cache";
import path from "path";
import {init} from "./app";

const app = new Koa();

app.use(
  staticCache(path.resolve(__dirname, "../assets"), {
    maxAge: 365 * 24 * 60 * 60,
    buffer: true,
      prefix: `/assets`,
        dynamic: false,
  })
);

init(app);

app.listen(process.env.PORT || 3000);


