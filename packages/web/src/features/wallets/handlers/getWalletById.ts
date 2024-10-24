import { __API_URL__ } from "@/config/constants";
import type { Wallet } from "@/features/wallets/wallets.types";

export const getWalletById = async (id: Wallet["id"]) => {
  const url = new URL(`/api/wallets/${id}`, __API_URL__);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as Wallet;
};
