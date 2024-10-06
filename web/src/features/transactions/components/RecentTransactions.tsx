import { Pagination } from "@/features/misc/components/Pagination";
import { usePagination } from "@/features/misc/hooks/usePagination";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { CreateTransaction } from "@/features/transactions/components/CreateTransaction";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import type { User } from "@/features/users/users.types";
import { lazily } from "react-lazily";

const { TransactionCard } = lazily(() => import("@/features/transactions/components/TransactionCard"));

interface RecentTransactionProps {
  userId: User["id"];
  defaultWalletId?: string;
}

export const RecentTransactions = ({ userId, defaultWalletId }: RecentTransactionProps) => {
  const { pagination, onPaginationChange } = usePagination();
  const { data: transactions } = useTransactions(pagination, defaultWalletId);

  const { close, isOpen, open } = useToggle();

  return (
    <section id="recent-transactions">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-md font-semibold text-textSecondary">Recent Transactions</h2>

        <button
          onClick={open}
          className="rounded border border-primary p-2 py-1.5 text-xs font-semibold text-primary outline-none"
        >
          Create Transaction
        </button>

        <CreateTransaction isOpen={isOpen} onClose={close} userId={userId} defaultWalletId={defaultWalletId} />
      </div>
      <div className="rounded border-2 py-2 shadow">
        <Pagination
          pagination={pagination}
          totalCount={transactions?.count ?? 0}
          onPaginationChange={onPaginationChange}
        />
        <ul className="flex flex-col gap-2 px-2">
          {transactions?.data.map((transaction) => (
            <li key={transaction.id}>
              <TransactionCard transaction={transaction} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
