import { __SERVER_URL__ } from "@/config/constants";
import type { Wallet } from "@/features/wallets/wallets.types";

export const deleteWallet = async (id: Wallet["id"]) => {
  const url = new URL(`/api/wallets/${id}`, __SERVER_URL__);

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
};
