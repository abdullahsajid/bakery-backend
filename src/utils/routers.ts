import { Hono } from "hono";
import { userRoutes } from "../features/user/user-routes";
const rootRouter = new Hono();

// rootRouter.get('/', (ctx) => {
//     return ctx.text('building...')
// });
rootRouter.get("/", (ctx) => ctx.text("Hello"));

export const routers = [rootRouter,userRoutes];