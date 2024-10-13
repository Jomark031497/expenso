import { Router } from "express";
import * as controller from "./users.controller.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertUserSchema } from "./users.schema.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireAdmin } from "../../middlewares/requireAdmin.js";
import { verifyUserOrAdmin } from "../../middlewares/verifyUserOrAdmin.js";

export const usersRouter = Router();

// Get all users
usersRouter.get("/", requireAuth, requireAdmin, controller.getUsersHandler);

// Get user summary
usersRouter.get("/summary", requireAuth, controller.getUserSummary);

// Get a single user by ID
usersRouter.get("/:id", requireAuth, verifyUserOrAdmin, controller.getUserByIdHandler);

// Create a new user
usersRouter.post("/", requireAuth, validateSchema(insertUserSchema), controller.createUserHandler);

// Update user by ID
usersRouter.patch(
  "/:id",
  requireAuth,
  verifyUserOrAdmin,
  validateSchema(insertUserSchema.partial()),
  controller.updateUserHandler,
);

// Delete a user by ID
usersRouter.delete("/:id", requireAuth, verifyUserOrAdmin, controller.deleteUserHandler);
