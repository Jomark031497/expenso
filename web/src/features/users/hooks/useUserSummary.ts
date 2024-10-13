import { getUserSummary } from "@/features/users/handlers/getUserSummary";
import type { TimeRangeType } from "@/features/users/users.types";
import { useQuery } from "@tanstack/react-query";

export const useUserSummary = (timeRangeType: TimeRangeType) => {
  return useQuery({
    queryKey: ["userSummary", timeRangeType],
    queryFn: async () => await getUserSummary(timeRangeType),
  });
};
