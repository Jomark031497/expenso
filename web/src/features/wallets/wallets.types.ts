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
