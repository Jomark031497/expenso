import { eq } from "drizzle-orm";
import { db } from "../../db/dbInstance.js";
import { AppError } from "../../utils/appError.js";
import { wallets, type NewWallet, type Wallet } from "./wallets.schema.js";
import { transactions } from "../transactions/transactions.schema.js";

export const getWallets = async (userId: Wallet["userId"]) => {
  return await db.query.wallets.findMany({
    where: (wallets, { eq }) => eq(wallets.userId, userId),
  });
};

export const getWalletById = async (walletId: Wallet["id"], options: { returnError?: boolean }) => {
  const wallet = await db.query.wallets.findFirst({
    where: (wallets, { eq }) => eq(wallets.id, walletId),
  });

  if (options.returnError && !wallet) throw new AppError(404, "get wallet failed", { walletId: "wallet id not found" });
  return wallet;
};

export const createWallet = async (payload: NewWallet) => {
  return await db.transaction(async (tx) => {
    const [wallet] = await tx.insert(wallets).values(payload).returning();

    if (!wallet) throw new AppError(400, "Database Error. Create wallet failed");

    const [transaction] = await tx
      .insert(transactions)
      .values({
        name: "Initial Balance",
        type: wallet.balance < "0" ? "expense" : "income",
        amount: wallet.balance,
        walletId: wallet.id,
        userId: payload.userId,
        category: "initial balance",
      })
      .returning();

    if (!transaction) throw new AppError(400, "Database Error. Create wallet failed");

    return wallet;
  });
};

export const updateWallet = async (walletId: Wallet["id"], payload: Partial<NewWallet>) => {
  const wallet = await getWalletById(walletId, { returnError: false });
  if (!wallet) throw new AppError(404, "update wallet failed", { walletId: "wallet id not found" });

  const [updatedWallet] = await db.update(wallets).set(payload).where(eq(wallets.id, walletId)).returning();

  if (!updatedWallet) throw new AppError(400, "update wallet failed");

  return updatedWallet;
};

export const deleteWallet = async (walletId: Wallet["id"]) => {
  const wallet = await getWalletById(walletId, { returnError: false });
  if (!wallet) throw new AppError(404, "delete wallet failed", { walletId: "wallet id not found" });

  await db.delete(wallets).where(eq(wallets.id, walletId));

  return { message: "wallet deleted successfully" };
};
