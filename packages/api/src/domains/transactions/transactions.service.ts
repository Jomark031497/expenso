import { eq, sql } from "drizzle-orm";
import { db } from "../../db/dbInstance.js";
import { AppError } from "../../utils/appError.js";
import type { NewTransaction, NewTransactionCategory } from "./transactions.schema.js";
import { transactionCategories, transactions, type Transaction } from "./transactions.schema.js";
import { wallets } from "../wallets/wallets.schema.js";
import type { User } from "../users/users.schema.js";

export const getTransactions = async (userId: Transaction["userId"], options: Record<string, unknown>) => {
  const pageSize = options?.pageSize ? parseInt(options.pageSize as string, 10) : 5;
  const page = options?.page ? parseInt(options.page as string) : 1;

  return await db.transaction(async (tx) => {
    const transactionsData = await tx.query.transactions.findMany({
      where: (transactions, { eq }) => eq(transactions.userId, userId),
      orderBy: (transactions, { desc }) => desc(transactions.createdAt),
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: {
        wallet: {
          columns: {
            name: true,
            type: true,
          },
        },
        category: true,
      },
    });

    const count = await tx
      .select({ count: sql`count(*)` })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .then((result) => Number(result[0]?.count));

    return {
      data: transactionsData,
      count,
    };
  });
};

export const getTransactionsByWalletId = async (
  walletId: Transaction["walletId"],
  options: Record<string, unknown>,
) => {
  const pageSize = options?.pageSize ? parseInt(options.pageSize as string, 10) : 5;
  const page = options?.page ? parseInt(options.page as string) : 1;

  return await db.transaction(async (tx) => {
    const transactionsData = await tx.query.transactions.findMany({
      where: (transactions, { eq }) => eq(transactions.walletId, walletId),
      orderBy: (transactions, { desc }) => desc(transactions.createdAt),
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: {
        wallet: {
          columns: {
            name: true,
            type: true,
          },
        },
        category: true,
      },
    });

    const count = await tx
      .select({ count: sql`count(*)` })
      .from(transactions)
      .where(eq(transactions.walletId, walletId))
      .then((result) => Number(result[0]?.count));

    return {
      data: transactionsData,
      count,
    };
  });
};

export const getTransactionById = async (transactionId: Transaction["id"], options: { returnError?: boolean }) => {
  const transaction = await db.query.transactions.findFirst({
    where: (transactions, { eq }) => eq(transactions.id, transactionId),
    with: {
      wallet: {
        columns: {
          name: true,
          type: true,
        },
      },
      category: true,
    },
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

  await db.transaction(async (tx) => {
    // delete the transaction
    await tx.delete(transactions).where(eq(transactions.id, transactionId));

    // revert the balance of the wallet
    const balanceAdjustment =
      transaction.type === "income"
        ? sql`${wallets.balance}::numeric - ${transaction.amount}::numeric`
        : sql`${wallets.balance}::numeric + ${transaction.amount}::numeric`;

    await tx.update(wallets).set({ balance: balanceAdjustment }).where(eq(wallets.id, transaction.walletId));
  });

  return { message: "transaction deleted successfully" };
};

export const getTransactionCategories = async (userId: User["id"], type: Transaction["type"] = "income") => {
  const categories = await db.query.transactionCategories.findMany({
    where: (transactionCategories, { eq, or, and }) =>
      and(
        eq(transactionCategories.type, type),
        or(eq(transactionCategories.isDefault, true), eq(transactionCategories.userId, userId)),
      ),
    orderBy: (transactionCategories, { asc }) => asc(transactionCategories.name),
  });

  return categories;
};

export const createTransactionCategory = async (payload: NewTransactionCategory) => {
  const [result] = await db.insert(transactionCategories).values(payload).returning();
  return result;
};
