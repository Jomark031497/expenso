import { z } from "zod";

export const createWalletSchema = z.object({
  name: z.string().min(3),
  type: z.enum(["cash", "credit_card", "debit_card"]),
  balance: z.string().refine((val) => /^[0-9,]+(\.[0-9]{1,2})?$/.test(val), {
    message: "Balance must be a number with optional commas and up to 2 decimal places",
  }),
  description: z.string().optional(),
});
