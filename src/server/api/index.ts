import Router from "koa-router";

import { signin, signup } from "./auth";
import { health } from "./health";

const router = new Router();

router.get("/health", health);
router.post("/auth/signin", signin);
router.post("/auth/signup", signup);

export { router };
