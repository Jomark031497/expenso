import { eq, sql } from "drizzle-orm";
import { db } from "../../db/dbInstance.js";
import { AppError } from "../../utils/appError.js";
import type { NewTransaction } from "./transactions.schema.js";
import { transactions, type Transaction } from "./transactions.schema.js";
import { wallets } from "../wallets/wallets.schema.js";

export const getTransactions = async (userId: Transaction["userId"]) => {
  return await db.query.transactions.findMany({
    where: (transactions, { eq }) => eq(transactions.userId, userId),
  });
};

export const getTransactionsByWalletId = async (walletId: Transaction["walletId"]) => {
  return await db.query.transactions.findMany({
    where: (transactions, { eq }) => eq(transactions.walletId, walletId),
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
  return await db.transaction(async (tx) => {
    const balance =
      payload.type === "income"
        ? sql`${wallets.balance} + ${payload.amount}`
        : sql`${wallets.balance} - ${payload.amount}`;
    await tx.update(wallets).set({ balance }).where(eq(wallets.id, payload.walletId));

    const [transaction] = await tx.insert(transactions).values(payload).returning();

    return transaction;
  });
};

export const updateTransaction = async (transactionId: Transaction["id"], payload: Partial<NewTransaction>) => {
  const transaction = await getTransactionById(transactionId, { returnError: false });
  if (!transaction) throw new AppError(400, "update transaction failed", { transactionId: "transaction id not found" });

  // prevent updating the user or wallet of a transaction
  if (payload.walletId || payload.userId)
    throw new AppError(400, "update transaction failed. it is forbidden to update userId or walletId");

  return await db.transaction(async (tx) => {
    // update the transaction
    const [updatedTransaction] = await tx
      .update(transactions)
      .set(payload)
      .where(eq(transactions.id, transactionId))
      .returning();

    // update the balance if amount and type is included in the payload
    if (payload.amount || payload.type) {
      const newAmount = payload.amount ?? transaction.amount;

      const newType = payload.type ?? transaction.type;

      // revert the balance of the wallet
      const balanceAdjustment =
        transaction.type === "income"
          ? sql`${wallets.balance}::numeric - ${transaction.amount}::numeric`
          : sql`${wallets.balance}::numeric + ${transaction.amount}::numeric`;

      // apply the updated balance
      const updatedBalance =
        newType === "income"
          ? sql`${balanceAdjustment}::numeric + ${newAmount}::numeric`
          : sql`${balanceAdjustment}::numeric - ${newAmount}::numeric`;

      await tx.update(wallets).set({ balance: updatedBalance }).where(eq(wallets.id, transaction.walletId));
    }

    return updatedTransaction;
  });
};

export const deleteTransaction = async (transactionId: Transaction["id"]) => {
  const transaction = await getTransactionById(transactionId, { returnError: false });
  if (!transaction) throw new AppError(400, "delete transaction failed", { transactionId: "transaction id not found" });

  await db.delete(transactions).where(eq(transactions.id, transactionId));

  return { message: "transaction deleted successfully" };
};
