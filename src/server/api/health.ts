import { Context } from "koa";

export async function health(ctx: Context) {
  ctx.status = 200;
  ctx.body = {
    ok: true
  };
}
