import type { createTransactionSchema } from "@/features/transactions/transactions.schema";
import type { Wallet } from "@/features/wallets/wallets.types";
import type { z } from "zod";

export const TRANSACTION_TYPES = ["income", "expense", "transfer"] as const;

export type Transaction = {
  id: string;
  userId: string;
  name: string;
  amount: string;
  type: "income" | "expense" | "transfer";
  description?: string;
  date: Date;
  walletId: string;
  createdAt: Date;
  updatedAt: Date;
  wallet: Pick<Wallet, "name" | "type">;
  categoryId: string;
};

export type TransactionCategory = {
  id: string;
  name: string;
  type: "income" | "expense" | "transfer";
  isDefault: boolean;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionWithCategory = Transaction & {
  category: TransactionCategory;
};

export type NewTransaction = z.infer<typeof createTransactionSchema>;
