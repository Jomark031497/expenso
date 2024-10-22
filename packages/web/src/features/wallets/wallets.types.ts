import type { createWalletSchema } from "@/features/wallets/wallets.schema";
import type { z } from "zod";

export type Wallet = {
  id: string;
  userId: string;
  name: string;
  type: "cash" | "credit_card" | "debit_card";
  balance: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NewWallet = z.infer<typeof createWalletSchema>;
