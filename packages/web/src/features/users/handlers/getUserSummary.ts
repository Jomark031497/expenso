import { __API_URL__ } from "@/config/constants";
import type { TimeRangeType } from "@/features/users/users.types";
import type { Wallet } from "@/features/wallets/wallets.types";

export const getUserSummary = async (timeRangeType: TimeRangeType, walletId?: Wallet["id"]) => {
  const url = new URL("/api/users/summary", __API_URL__);

  url.searchParams.set("timeRangeType", timeRangeType);
  walletId && url.searchParams.set("wallet_id", walletId);

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
