import { Router } from "express";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertUserSchema } from "../users/users.schema.js";
import * as controller from "./auth.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

export const authRouter = Router();

authRouter.post("/sign-up", validateSchema(insertUserSchema), controller.signUpUserHandler);
authRouter.post(
  "/login",
  validateSchema(insertUserSchema.pick({ username: true, password: true })),
  controller.loginUserHandler,
);

authRouter.get("/user", requireAuth, controller.getAuthenticatedUserHandler);

authRouter.delete("/logout", requireAuth, controller.logoutUserHandler);
