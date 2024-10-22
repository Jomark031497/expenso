import { __SERVER_URL__ } from "@/config/constants";
import type { NewTransaction, Transaction, TransactionWithCategory } from "@/features/transactions/transactions.types";

export const updateTransaction = async (transactionId: Transaction["id"], payload: NewTransaction) => {
  const url = new URL(`/api/transactions/${transactionId}`, __SERVER_URL__);

  const response = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as TransactionWithCategory;
};
