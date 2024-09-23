import { getWallets } from "@/features/wallets/handlers/getWallets";
import { useQuery } from "@tanstack/react-query";

export const useWallets = () => {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
  });
};
