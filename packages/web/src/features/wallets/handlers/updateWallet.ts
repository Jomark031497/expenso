import { __SERVER_URL__ } from "@/config/constants";
import type { NewWallet } from "@/features/wallets/components/CreateWallet";
import type { Wallet } from "@/features/wallets/wallets.types";

export const updateWallet = async (walletId: Wallet["id"], payload: NewWallet) => {
  const url = new URL(`/api/wallets/${walletId}`, __SERVER_URL__);

  const response = await fetch(url, {
    method: "PATCH",
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
