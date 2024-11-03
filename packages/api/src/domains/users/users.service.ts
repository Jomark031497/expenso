import { and, eq, gte, lte, sql } from "drizzle-orm";
import type { NewUser, User } from "./users.schema.js";
import { users } from "./users.schema.js";
import { db } from "../../db/dbInstance.js";
import { AppError } from "../../utils/appError.js";
import { Argon2id } from "oslo/password";
import { excludeFields } from "../../utils/excludeFields.js";
import { getTimeRange, type TimeRangeType } from "../../utils/getTimeRange.js";
import { transactions } from "../transactions/transactions.schema.js";
import type { Wallet } from "../wallets/wallets.schema.js";

export const getUsers = async () => {
  return await db.query.users.findMany({
    columns: { password: false },
  });
};

export const getUser = async (field: keyof User, value: string | number, returnError: boolean = true) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users[field], value),
  });

  if (!user && (returnError ?? true)) throw new AppError(404, `${field} not found`);

  return user;
};

export const createUser = async (payload: NewUser) => {
  const errors: Record<string, unknown> = {};
  let emailExists;
  let hashedPassword;

  const usernameExists = await getUser("username", payload.username, false);
  if (payload.email) emailExists = await getUser("email", payload.email, false);

  if (usernameExists) errors.username = "username is already taken";
  if (emailExists) errors.email = "email is already taken";
  if (Object.keys(errors).length) throw new AppError(400, "create user failed", errors);

  if (payload.password) hashedPassword = await new Argon2id().hash(payload.password);

  const [user] = await db
    .insert(users)
    .values({
      ...payload,
      ...(hashedPassword && {
        password: hashedPassword,
      }),
    })
    .returning();

  if (!user) throw new AppError(400, "create user failed");

  return excludeFields(user, ["password"]);
};

export const updateUser = async (id: User["id"], payload: Partial<NewUser>) => {
  const existingUser = await getUser("id", id, false);
  if (!existingUser) throw new AppError(404, "update user failed. userId not found");

  if (payload.username) {
    const usernameExists = await getUser("username", payload.username, false);
    if (usernameExists)
      throw new AppError(400, "update user failed", {
        username: "username is already taken",
      });
  }

  if (payload.email) {
    const emailExists = await getUser("email", payload.email);
    if (emailExists) throw new AppError(400, "update user failed", { email: "email is already taken" });
  }

  if (payload.password) payload.password = await new Argon2id().hash(payload.password);

  const query = await db.update(users).set(payload).where(eq(users.id, id)).returning();
  if (!query[0]) throw new AppError(400, "update user failed");

  return excludeFields(query[0], ["password"]);
};

export const deleteUser = async (id: User["id"]) => {
  const existingUser = await getUser("id", id, false);
  if (!existingUser) throw new AppError(404, "delete user failed. userId not found");

  await db.delete(users).where(eq(users.id, id)).returning();

  return { message: "user deleted successfully" };
};

export const getUserSummary = async (userId: User["id"], timeRangeType: TimeRangeType, walletId?: Wallet["id"]) => {
  const timeRange = getTimeRange(timeRangeType);

  const [transactionSummary] = await db
    .select({
      totalIncome: sql`SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)`,
      totalExpenses: sql`SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.date, timeRange.startDate.toISOString()),
        lte(transactions.date, timeRange.endDate.toISOString()),
        walletId ? eq(transactions.walletId, walletId) : undefined,
      ),
    )
    .execute();

  if (!transactionSummary) throw new AppError(400, "unable to query transactionSummary");

  const income = (transactionSummary.totalIncome as string) || "0";
  const expenses = (transactionSummary.totalExpenses as string) || "0";

  return {
    income,
    expenses,
    balance: parseInt(income) - parseInt(expenses),
    timeRange,
  };
};
