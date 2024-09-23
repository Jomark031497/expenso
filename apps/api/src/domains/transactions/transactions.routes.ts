import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertTransactionSchema } from "./transactions.schema.js";
import * as controller from "./transactions.controller.js";

export const transactionsRouter = Router();

transactionsRouter.post("/", requireAuth, validateSchema(insertTransactionSchema), controller.createTransactionHandler);

transactionsRouter.get("/", requireAuth, controller.getTransactionsHandler);

transactionsRouter.get("/wallets/:walletId", requireAuth, controller.getTransactionsByWalletIdHandler);

transactionsRouter.patch("/:id", requireAuth, controller.updatedTransactionHandler);

transactionsRouter.delete("/:id", requireAuth, controller.deleteTransactionHandler);
