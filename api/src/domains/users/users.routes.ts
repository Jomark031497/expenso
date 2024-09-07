import { Router } from "express";
import * as controller from "./users.controller.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertUserSchema } from "./users.schema.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const router = Router();

// router.get("/", controller.getUsersHandler);

// router.get("/:id", controller.getUserByIdHandler);

router.post("/", validateSchema(insertUserSchema), controller.createUserHandler);

router.patch("/:id", requireAuth, validateSchema(insertUserSchema.partial()), controller.updateUserHandler);

router.delete("/:id", requireAuth, controller.deleteUserHandler);

export const usersRouter = router;
