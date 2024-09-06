import { Router } from "express";
import * as controller from "./auth.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertUserSchema } from "../users/users.schema.js";

export const authRouter = Router();

authRouter.get("/user", requireAuth, controller.getAuthenticatedUserHandler);

authRouter.post(
  "/login",
  validateSchema(insertUserSchema.pick({ username: true, password: true })),
  controller.loginUserHandler,
);

authRouter.post("/sign-up", validateSchema(insertUserSchema), controller.signUpUserHandler);

authRouter.delete("/logout", requireAuth, controller.logoutUserHandler);
