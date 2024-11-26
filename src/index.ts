require("dotenv").config();

import { Hono } from "hono";
import { routers } from "./utils/routers";
import { serve } from "@hono/node-server";
import { connect } from "./configs/database";

const app = new Hono();
const port = 8080;

connect();

const server = serve({
  fetch: app.fetch,
  port: Number(port),
});

routers.forEach((router) => {
    app.route('/',router);
});

console.log('Server is running...');