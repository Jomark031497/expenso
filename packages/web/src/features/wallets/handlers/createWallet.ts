import { __SERVER_URL__ } from "@/config/constants";
import type { NewWallet, Wallet } from "@/features/wallets/wallets.types";

export const createWallet = async (payload: NewWallet & { userId: Wallet["userId"] }) => {
  const url = new URL("/api/wallets", __SERVER_URL__);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as Wallet;
};
