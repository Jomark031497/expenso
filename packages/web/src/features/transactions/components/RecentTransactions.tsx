import { Pagination } from "@/features/misc/components/Pagination";
import { usePagination } from "@/features/misc/hooks/usePagination";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import type { Wallet } from "@/features/wallets/wallets.types";
import { lazily } from "react-lazily";

const { TransactionCard, TransactionCardSkeleton } = lazily(
  () => import("@/features/transactions/components/TransactionCard"),
);

interface RecentTransactionProps {
  defaultWalletId?: Wallet["id"];
}

export const RecentTransactions = ({ defaultWalletId }: RecentTransactionProps) => {
  const { onPaginationChange, pagination } = usePagination();

  const { data: transactions } = useTransactions(pagination, defaultWalletId);

  return (
    <div className="rounded border-2 py-2 shadow">
      <Pagination
        pagination={pagination}
        totalCount={transactions.count ?? 0}
        onPaginationChange={onPaginationChange}
      />
      <ul className="flex flex-col gap-2 px-2">
        {transactions.data.map((transaction) => (
          <li key={transaction.id}>
            <TransactionCard transaction={transaction} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RecentTransactionsSkeleton = () => {
  return (
    <div role="status" className="rounded border-2 py-2 shadow">
      <div className="h-[72px]"></div>
      <div className="flex flex-col gap-2 px-2">
        <TransactionCardSkeleton />
        <TransactionCardSkeleton />
        <TransactionCardSkeleton />
        <TransactionCardSkeleton />
        <TransactionCardSkeleton />
      </div>
    </div>
  );
};
