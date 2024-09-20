import { eq, sql } from "drizzle-orm";
import { db } from "../../db/dbInstance.js";
import { AppError } from "../../utils/appError.js";
import { getUser } from "../users/users.service.js";
import { getWalletById } from "../wallets/wallets.service.js";
import type { NewTransaction } from "./transactions.schema.js";
import { transactions, type Transaction } from "./transactions.schema.js";
import { wallets } from "../wallets/wallets.schema.js";

export const getTransactions = async (userId: Transaction["userId"]) => {
  return await db.query.transactions.findMany({
    where: (transactions, { eq }) => eq(transactions.userId, userId),
  });
};

export const getTransactionById = async (transactionId: Transaction["id"], options: { returnError?: boolean }) => {
  const transaction = await db.query.transactions.findFirst({
    where: (transactions, { eq }) => eq(transactions.id, transactionId),
  });

  if (options.returnError && !transaction)
    throw new AppError(404, "get transaction failed", { transactionId: "transaction id not found" });

  return transaction;
};

export const createTransaction = async (payload: NewTransaction) => {
  if (payload.type === "income") {
    return await db.transaction(async (tx) => {
      await tx
        .update(wallets)
        .set({ balance: sql`${wallets.balance} + ${payload.amount}` })
        .where(eq(wallets.id, payload.walletId));

      const [transaction] = await tx.insert(transactions).values(payload).returning();

      return transaction;
    });
  } else if (payload.type === "expense") {
    return await db.transaction(async (tx) => {
      await tx
        .update(wallets)
        .set({ balance: sql`${wallets.balance} - ${payload.amount}` })
        .where(eq(wallets.id, payload.walletId));

      const [transaction] = await tx.insert(transactions).values(payload).returning();

      return transaction;
    });
  } else {
    throw new AppError(400, "invalid transaction type");
  }
};

export const updateTransaction = async (transactionId: Transaction["id"], payload: Partial<NewTransaction>) => {
  const transaction = await getTransactionById(transactionId, { returnError: false });
  if (!transaction) throw new AppError(400, "update transaction failed", { transactionId: "transaction id not found" });

  if (!payload.walletId) throw new AppError(400, "update transaction failed", { walletId: "wallet id not found" });
  const wallet = await getWalletById(payload.walletId, { returnError: false });
  if (!wallet) throw new AppError(400, "update transaction failed", { walletId: "wallet id not found" });

  if (!payload.userId) throw new AppError(400, "update transaction failed", { userId: "user id not found" });
  const user = await getUser("id", payload.userId, { returnError: false });
  if (!user) throw new AppError(400, "update transaction failed", { userId: "user id not found" });

  if (payload.amount) {
    // REVERT THE PAST TRANSACTION FIRST
    // UPDATE VIA NEW PAYLOAD
  } else {
    const [updatedTransaction] = await db
      .update(transactions)
      .set(payload)
      .where(eq(transactions.id, transactionId))
      .returning();
    if (!updatedTransaction) throw new AppError(400, "update transaction failed");

    return updatedTransaction;
  }
};

export const deleteTransaction = async (transactionId: Transaction["id"]) => {
  const transaction = await getTransactionById(transactionId, { returnError: false });
  if (!transaction) throw new AppError(400, "delete transaction failed", { transactionId: "transaction id not found" });

  await db.delete(transactions).where(eq(transactions.id, transactionId));

  return { message: "transaction deleted successfully" };
};
