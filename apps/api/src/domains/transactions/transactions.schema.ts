import { createId } from "@paralleldrive/cuid2";
import { numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users/users.schema.js";
import { relations } from "drizzle-orm";
import { wallets } from "../wallets/wallets.schema.js";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const TRANSACTION_TYPE = ["income", "expense", "transfer"] as const;

export const transactionTypeEnum = pgEnum("type", TRANSACTION_TYPE);

export const transactions = pgTable("transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
  walletId: text("wallet_id")
    .notNull()
    .references(() => wallets.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions);

export const selectTransactionSchema = createSelectSchema(transactions);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
