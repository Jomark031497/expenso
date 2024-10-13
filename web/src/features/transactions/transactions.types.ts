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
  date: string;
  walletId: string;
  createdAt: Date;
  updatedAt: Date;
  wallet: Pick<Wallet, "name" | "type">;
  category: string;
};

export type NewTransaction = z.infer<typeof createTransactionSchema>;
