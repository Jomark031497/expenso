import { createId } from "@paralleldrive/cuid2";
import { boolean, numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users/users.schema.js";
import { relations } from "drizzle-orm";
import { wallets } from "../wallets/wallets.schema.js";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const TRANSACTION_TYPES = ["income", "expense", "transfer"] as const;

export const transactionTypeEnum = pgEnum("type", TRANSACTION_TYPES);

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
  categoryId: text("category_id")
    .notNull()
    .references(() => transactionCategories.id),
  date: timestamp("date", { mode: "string" }).notNull().defaultNow(),
  walletId: text("wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
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
  category: one(transactionCategories, {
    fields: [transactions.categoryId],
    references: [transactionCategories.id],
  }),
}));

export const transactionCategories = pgTable("transaction_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  type: transactionTypeEnum("type").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  userId: text("user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const transactionCategoriesRelations = relations(transactionCategories, ({ one, many }) => ({
  user: one(users, {
    fields: [transactionCategories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);

export const insertTransactionCategorySchema = createInsertSchema(transactionCategories);
export const selectTransactionCategorySchema = createSelectSchema(transactionCategories);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type TransactionCategory = typeof transactionCategories.$inferSelect;
export type NewTransactionCategory = typeof transactionCategories.$inferInsert;
