import { TRANSACTION_TYPES } from "@/features/transactions/transactions.types";
import { z } from "zod";

export const TRANSACTION_CATEGORIES = [
  "salary",
  "investment",
  "groceries",
  "rent",
  "utilities",
  "entertainment",
  "debt",
  "miscellaneous",
  "initial balance",
] as const;

export const createTransactionSchema = z.object({
  name: z.string().min(3),
  amount: z.string().refine((val) => /^[0-9,]+(\.[0-9]{1,2})?$/.test(val), {
    message: "Amount must be a number with optional commas and up to 2 decimal places",
  }),
  type: z.enum(TRANSACTION_TYPES),
  description: z.string().optional(),
  category: z.string(),
  date: z.date(),
  walletId: z.string(),
  userId: z.string(),
});
