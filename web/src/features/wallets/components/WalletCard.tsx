import type { Wallet } from "@/features/wallets/wallets.types";
import { toCurrency } from "@/utils/toCurrency";
import { toFormattedTitleCase } from "@/utils/toFormattedTitleCase";
import { FaMoneyBillWave, FaCreditCard, FaMoneyCheck } from "react-icons/fa";

interface WalletCardProps {
  wallet: Wallet;
}

export const WalletCard = ({ wallet }: WalletCardProps) => {
  return (
    <div className="from-primaryDark max-w-md flex-1 rounded bg-gradient-to-r to-primary p-2 text-white">
      <div className="flex items-center gap-2">
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
          <p className="text-base font-semibold">{wallet.name}</p>
          <p className="text-xs font-medium">{toFormattedTitleCase(wallet.type)}</p>
        </div>
      </div>

      <p className="text-end text-xs font-medium">
        {wallet.type === "credit_card" ? "Outstanding Balance" : "Available Balance"}
      </p>
      <p className="text-end text-base font-semibold">{toCurrency(parseInt(wallet.balance))}</p>
    </div>
  );
};
