import { useUserSummary } from "@/features/users/hooks/useUserSummary";
import type { TimeRangeType } from "@/features/users/users.types";
import type { Wallet } from "@/features/wallets/wallets.types";
import { toCurrency } from "@/utils/toCurrency";

interface UserSummaryProps {
  timeRangeType: TimeRangeType;
  walletId?: Wallet["id"];
}

export const UserSummary = ({ timeRangeType, walletId }: UserSummaryProps) => {
  const { data: userSummary } = useUserSummary(timeRangeType, walletId);

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-1 rounded border bg-white p-4 text-center shadow">
        <p className="mb-2 text-xs font-semibold">Expenses</p>
        <p className="text-sm font-semibold text-error">{toCurrency(parseInt(userSummary.expenses))}</p>
      </div>
      <div className="col-span-1 rounded border bg-white p-4 text-center shadow">
        <p className="mb-2 text-xs font-semibold">Income</p>
        <p className="text-sm font-semibold text-green-600">{toCurrency(parseInt(userSummary.income))}</p>
      </div>
      <div className="col-span-1 rounded border bg-white p-4 text-center shadow">
        <p className="mb-2 text-xs font-semibold">Balance</p>
        <p className="text-sm font-semibold text-blue-600">{toCurrency(userSummary.balance)}</p>
      </div>
    </div>
  );
};
