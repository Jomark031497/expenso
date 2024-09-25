import { getTransactions } from "@/features/transactions/handlers/getTransactions";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
};
