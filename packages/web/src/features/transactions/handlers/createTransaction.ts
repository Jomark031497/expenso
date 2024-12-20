import { __API_URL__ } from "@/config/constants";
import type { NewTransaction, Transaction } from "@/features/transactions/transactions.types";

export const createTransaction = async (payload: NewTransaction) => {
  const url = new URL("/api/transactions", __API_URL__);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as Transaction;
};
