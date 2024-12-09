require("dotenv").config();

import { Hono } from "hono";
import { routers } from "./utils/routers";
import { serve } from "@hono/node-server";
import { connect } from "./configs/database";
import { cors } from "hono/cors";
const app = new Hono();
const port = 8080;
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type"],
  })
);

connect();

const server = serve({
  fetch: app.fetch,
  port: Number(port),
});

routers.forEach((router) => {
    app.route('/',router);
});

console.log('Server is running...');