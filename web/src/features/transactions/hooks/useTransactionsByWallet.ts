import type { RequestQueryOptions } from "@/features/misc/misc.types";
import { getTransactionsByWallet } from "@/features/transactions/handlers/getTransactionsByWallet";
import type { Transaction } from "@/features/transactions/transactions.types";
import { useQuery } from "@tanstack/react-query";

export const useTransactionsByWallet = (walletId: Transaction["walletId"], queryOptions: RequestQueryOptions) => {
  return useQuery({
    queryKey: ["walletTransactions", walletId, queryOptions.page, queryOptions.pageSize],
    queryFn: async () => await getTransactionsByWallet(walletId, queryOptions),
  });
};
