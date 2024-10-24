import { __API_URL__ } from "@/config/constants";
import type { Transaction } from "@/features/transactions/transactions.types";

export const deleteTransaction = async (transactionId: Transaction["id"]) => {
  const url = new URL(`/api/transactions/${transactionId}`, __API_URL__);

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
};
