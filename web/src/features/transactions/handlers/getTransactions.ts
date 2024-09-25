import { __SERVER_URL__ } from "@/config/constants";
import type { Transaction } from "@/features/transactions/transactions.types";

export const getTransactions = async () => {
  const url = new URL("/api/transactions", __SERVER_URL__);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as Transaction[];
};
