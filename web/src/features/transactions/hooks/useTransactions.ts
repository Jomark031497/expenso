import type { RequestQueryOptions } from "@/features/misc/misc.types";
import { getTransactions } from "@/features/transactions/handlers/getTransactions";
import { getTransactionsByWallet } from "@/features/transactions/handlers/getTransactionsByWallet";
import type { Wallet } from "@/features/wallets/wallets.types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useTransactions = (queryOptions: RequestQueryOptions, walletId?: Wallet["id"]) => {
  return useSuspenseQuery({
    queryKey: ["transactions", queryOptions.page, queryOptions.pageSize, walletId],
    queryFn: async () => {
      if (!walletId) {
        return await getTransactions(queryOptions);
      } else {
        return await getTransactionsByWallet(walletId, queryOptions);
      }
    },
  });
};
