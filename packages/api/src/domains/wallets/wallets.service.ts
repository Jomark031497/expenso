import { eq } from "drizzle-orm";
import { db } from "../../db/dbInstance.js";
import { AppError } from "../../utils/appError.js";
import { wallets, type NewWallet, type Wallet } from "./wallets.schema.js";

export const getWallets = async (userId: Wallet["userId"]) => {
  return await db.query.wallets.findMany({
    where: (wallets, { eq }) => eq(wallets.userId, userId),
  });
};

export const getWalletById = async (walletId: Wallet["id"], returnError: boolean = true) => {
  const wallet = await db.query.wallets.findFirst({ where: (wallets, { eq }) => eq(wallets.id, walletId) });
  if (returnError && !wallet) throw new AppError(404, "get wallet failed", { walletId: "wallet id not found" });

  return wallet;
};

export const createWallet = async (payload: NewWallet) => {
  return await db.insert(wallets).values(payload).returning();
};

export const updateWallet = async (walletId: Wallet["id"], payload: Partial<NewWallet>) => {
  const wallet = await getWalletById(walletId, false);
  if (!wallet) throw new AppError(404, "update wallet failed", { walletId: "wallet id not found" });

  const [updatedWallet] = await db.update(wallets).set(payload).where(eq(wallets.id, walletId)).returning();
  if (!updatedWallet) throw new AppError(400, "update wallet failed");

  return updatedWallet;
};

export const deleteWallet = async (walletId: Wallet["id"]) => {
  const wallet = await getWalletById(walletId, false);
  if (!wallet) throw new AppError(404, "delete wallet failed", { walletId: "wallet id not found" });
  await db.delete(wallets).where(eq(wallets.id, walletId));

  return { message: "wallet deleted successfully" };
};
