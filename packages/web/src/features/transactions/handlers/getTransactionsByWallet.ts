import { __API_URL__ } from "@/config/constants";
import type { RequestQueryOptions } from "@/features/misc/misc.types";
import type { Transaction, TransactionWithCategory } from "@/features/transactions/transactions.types";

export const getTransactionsByWallet = async (walletId: Transaction["walletId"], queryOptions: RequestQueryOptions) => {
  const url = new URL(`/api/transactions/wallets/${walletId}`, __API_URL__);

  queryOptions?.page && url.searchParams.set("page", queryOptions.page.toString());
  queryOptions?.pageSize && url.searchParams.set("pageSize", queryOptions.pageSize.toString());

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as { data: TransactionWithCategory[]; count: number };
};
