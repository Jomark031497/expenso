import { createId } from "@paralleldrive/cuid2";
import { numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users/users.schema.js";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { transactions } from "../transactions/transactions.schema.js";

export const WALLET_TYPE = ["cash", "debit_card", "credit_card"] as const;

export const walletTypeEnum = pgEnum("wallet_type", WALLET_TYPE);

export const wallets = pgTable("wallets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  type: walletTypeEnum("type").notNull(),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const insertWalletSchema = createInsertSchema(wallets, {
  name: (schema) =>
    schema.name.trim().min(1, "Wallet name is required").max(100, "Wallet name must not exceed 100 characters"),
  type: (schema) => schema.type,
  balance: (schema) =>
    schema.balance.refine((val) => /^[0-9,]+(\.[0-9]{1,2})?$/.test(val), {
      message: "Balance must be a number with optional commas and up to 2 decimal places",
    }),
  description: (schema) => schema.description.max(500, "Description must not exceed 500 characters").optional(),
});

export const selectWalletSchema = createSelectSchema(wallets);

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
