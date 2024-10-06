import { getWallets } from "@/features/wallets/handlers/getWallets";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useWallets = () => {
  return useSuspenseQuery({
    queryKey: ["wallets"],
    queryFn: async () => getWallets(),
  });
};
