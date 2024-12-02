import { Hono } from "hono";
import { userRoutes } from "../features/user/user-routes";
import { categoryRoutes } from "../features/category/category-routes";
import { productRoutes } from "../features/products/product-routes";
const rootRouter = new Hono();

// rootRouter.get('/', (ctx) => {
//     return ctx.text('building...')
// });
rootRouter.get("/", (ctx) => ctx.text("Hello"));

export const routers = [rootRouter,userRoutes,categoryRoutes,productRoutes];