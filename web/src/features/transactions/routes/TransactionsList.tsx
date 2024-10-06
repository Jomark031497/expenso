import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePagination } from "@/features/misc/hooks/usePagination";
import { RecentTransactions } from "@/features/transactions/components/RecentTransactions";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";

export const TransactionsList = () => {
  const { user } = useAuth();
  const { onPaginationChange, pagination } = usePagination();
  const { data: transactions } = useTransactions(pagination);

  if (!user) return <>no user</>;

  return (
    <>
      <p>This is Transactions List</p>
      <RecentTransactions
        userId={user.id}
        onPaginationChange={onPaginationChange}
        pagination={pagination}
        transactions={transactions}
      />
    </>
  );
};
