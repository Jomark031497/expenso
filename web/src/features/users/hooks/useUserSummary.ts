import { getUserSummary } from "@/features/users/handlers/getUserSummary";
import type { TimeRangeType } from "@/features/users/users.types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useUserSummary = (timeRangeType: TimeRangeType) => {
  return useSuspenseQuery({
    queryKey: ["userSummary", timeRangeType],
    queryFn: async () => await getUserSummary(timeRangeType),
  });
};
