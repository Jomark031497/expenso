import type { RequestQueryOptions } from "@/features/misc/misc.types";
import { getTransactions } from "@/features/transactions/handlers/getTransactions";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = (queryOptions: RequestQueryOptions) => {
  return useQuery({
    queryKey: ["transactions", queryOptions.page, queryOptions.pageSize],
    queryFn: async () => await getTransactions(queryOptions),
  });
};
