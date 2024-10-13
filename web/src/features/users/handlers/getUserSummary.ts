import { __SERVER_URL__ } from "@/config/constants";
import type { TimeRangeType } from "@/features/users/users.types";

export const getUserSummary = async (timeRangeType: TimeRangeType) => {
  const url = new URL("/api/users/summary", __SERVER_URL__);

  url.searchParams.set("timeRangeType", timeRangeType);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as {
    income: string;
    expenses: string;
    balance: number;
  };
};
