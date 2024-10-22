import { __SERVER_URL__ } from "@/config/constants";
import type { RequestQueryOptions } from "@/features/misc/misc.types";
import type { TransactionWithCategory } from "@/features/transactions/transactions.types";

export const getTransactions = async (queryOptions: RequestQueryOptions) => {
  const url = new URL("/api/transactions", __SERVER_URL__);

  queryOptions?.page && url.searchParams.set("page", queryOptions.page.toString());
  queryOptions?.pageSize && url.searchParams.set("pageSize", queryOptions.pageSize.toString());

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as { count: number; data: TransactionWithCategory[] };
};
