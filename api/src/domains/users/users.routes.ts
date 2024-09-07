import { Router } from "express";
import * as controller from "./users.controller.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertUserSchema } from "./users.schema.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireAdmin } from "../../middlewares/requireAdmin.js";

const router = Router();

// Create a new user
router.post("/", validateSchema(insertUserSchema), controller.createUserHandler);

// Get all users
router.get("/", requireAuth, requireAdmin, controller.getUsersHandler);

// Get a single user by ID
router.get("/:id", controller.getUserByIdHandler);

// Update an existing user by ID (partial updates)
router.patch("/:id", validateSchema(insertUserSchema.partial()), controller.updateUserHandler);

// Delete a user by ID
router.delete("/:id", controller.deleteUserHandler);

export const usersRouter = router;
