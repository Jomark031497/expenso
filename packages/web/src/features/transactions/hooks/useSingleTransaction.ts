import { getSingleTransaction } from "@/features/transactions/handlers/getSingleTransaction";
import type { Transaction } from "@/features/transactions/transactions.types";
import { useQuery } from "@tanstack/react-query";

export const useSingleTransaction = (transactionId: Transaction["id"]) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async () => await getSingleTransaction(transactionId),
  });
};
