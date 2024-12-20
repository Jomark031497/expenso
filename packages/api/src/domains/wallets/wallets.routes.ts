import { Router } from "express";
import * as controller from "./wallets.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertWalletSchema } from "./wallets.schema.js";

export const walletsRouter = Router();

walletsRouter.get("/", requireAuth, controller.getWalletsHandler);
walletsRouter.get("/:id", requireAuth, controller.getWalletByIdHandler);

walletsRouter.post("/", requireAuth, validateSchema(insertWalletSchema), controller.createWalletHandler);
walletsRouter.patch("/:id", requireAuth, validateSchema(insertWalletSchema.partial()), controller.updateWalletHandler);
walletsRouter.delete("/:id", requireAuth, controller.deleteWalletHandler);
