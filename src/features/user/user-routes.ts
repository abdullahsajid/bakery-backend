import { Hono } from "hono";
import UserController from "./user-controller";

export const userRoutes = new Hono();

userRoutes.post('/sign-up',UserController.signUp);
userRoutes.post('/sign-in', UserController.signIn);
userRoutes.post('/test', UserController.testbc);