import type { Wallet } from "@/features/wallets/wallets.types";

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
  category: string;
};
