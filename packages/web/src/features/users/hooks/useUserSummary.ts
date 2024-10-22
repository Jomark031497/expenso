import { getUserSummary } from "@/features/users/handlers/getUserSummary";
import type { TimeRangeType } from "@/features/users/users.types";
import type { Wallet } from "@/features/wallets/wallets.types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useUserSummary = (timeRangeType: TimeRangeType, walletId?: Wallet["id"]) => {
  return useSuspenseQuery({
    queryKey: ["userSummary", timeRangeType, walletId],
    queryFn: async () => await getUserSummary(timeRangeType, walletId),
  });
};
