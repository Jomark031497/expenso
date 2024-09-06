import { Router } from "express";
import * as controller from "./users.controller.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertUserSchema } from "./users.schema.js";

const router = Router();

router.get("/", controller.getUsersHandler);

router.get("/:id", controller.getUserByIdHandler);

router.post("/", validateSchema(insertUserSchema), controller.createUserHandler);

router.patch("/:id", validateSchema(insertUserSchema.partial()), controller.updateUserHandler);

router.delete("/:id", controller.deleteUserHandler);

export const usersRouter = router;
