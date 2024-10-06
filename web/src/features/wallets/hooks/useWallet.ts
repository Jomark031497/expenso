import { getWalletById } from "@/features/wallets/handlers/getWalletById";
import type { Wallet } from "@/features/wallets/wallets.types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useWallet = (id: Wallet["id"]) => {
  return useSuspenseQuery({
    queryKey: ["wallet", id],
    queryFn: () => getWalletById(id),
  });
};
