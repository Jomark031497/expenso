import { getTransactionCategories } from "@/features/transactions/handlers/getTransactionCategories";
import type { Transaction } from "@/features/transactions/transactions.types";
import type { User } from "@/features/users/users.types";
import { useQuery } from "@tanstack/react-query";

export const useTransactionCategories = (userId: User["id"], type: Transaction["type"]) => {
  return useQuery({
    queryKey: ["transactionCategories", userId, type],
    queryFn: async () => await getTransactionCategories(userId, type),
  });
};
