import { useWallet } from "@/features/wallets/hooks/useWallet";
import type { Wallet } from "@/features/wallets/wallets.types";
import { toCurrency } from "@/utils/toCurrency";
import { toFormattedTitleCase } from "@/utils/toFormattedTitleCase";
import { FaMoneyBillWave, FaCreditCard, FaMoneyCheck } from "react-icons/fa";

interface WalletCardProps {
  showDescription?: boolean;
  walletId: Wallet["id"];
}

export const WalletCard = ({ walletId, showDescription = false }: WalletCardProps) => {
  const { data: wallet } = useWallet(walletId as string);

  return (
    <div className="relative max-w-md flex-1 rounded bg-gradient-to-r from-primaryDark to-primary p-2 text-white">
      <div className="flex flex-1 items-center gap-2">
        <div className="rounded-full bg-white p-2 text-black">
          {wallet.type === "cash" ? (
            <FaMoneyBillWave />
          ) : wallet.type === "credit_card" ? (
            <FaCreditCard />
          ) : (
            <FaMoneyCheck />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold">{wallet.name}</p>
          <p className="font-sm text-xs">{toFormattedTitleCase(wallet.type)}</p>
          {showDescription && wallet.description && <p className="font-sm text-xs italic">{wallet.description}</p>}
        </div>
      </div>

      <p className="text-end text-xs font-medium">
        {wallet.type === "credit_card" ? "Outstanding Balance" : "Available Balance"}
      </p>
      <p className="text-end text-sm font-semibold">{toCurrency(parseInt(wallet.balance))}</p>
    </div>
  );
};

export const WalletCardSkeleton = () => {
  return <div role="status" className="min-h-[88px] flex-1 animate-pulse rounded bg-gray-300"></div>;
};
