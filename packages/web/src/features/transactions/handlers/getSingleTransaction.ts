import { __API_URL__ } from "@/config/constants";
import type { Transaction, TransactionWithCategory } from "@/features/transactions/transactions.types";

export const getSingleTransaction = async (transactionId: Transaction["id"]) => {
  const url = new URL(`/api/transactions/${transactionId}`, __API_URL__);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as TransactionWithCategory;
};
