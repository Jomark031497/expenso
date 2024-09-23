import { __SERVER_URL__ } from "@/config/constants";
import type { Wallet } from "@/features/wallets/wallets.types";

export const getWallets = async () => {
  const url = new URL("/api/wallets", __SERVER_URL__);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as Wallet[];
};
