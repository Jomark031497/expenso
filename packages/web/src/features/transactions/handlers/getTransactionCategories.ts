import { __SERVER_URL__ } from "@/config/constants";
import type { TransactionCategory } from "@/features/transactions/transactions.types";
import type { User } from "@/features/users/users.types";

export const getTransactionCategories = async (userId: User["id"], type: TransactionCategory["type"]) => {
  const url = new URL(`/api/transactions/categories/${userId}`, __SERVER_URL__);

  url.searchParams.set("type", type);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as TransactionCategory[];
};
