import { useAuth } from "@/features/auth/hooks/useAuth";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { usePagination } from "@/features/misc/hooks/usePagination";
import { RecentTransactions } from "@/features/transactions/components/RecentTransactions";
import { WalletsList } from "@/features/wallets/components/WalletsList";

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: wallets } = useWallets();

  const { pagination, onPaginationChange } = usePagination();
  const { data: transactions } = useTransactions(pagination);

  if (!user) return <>No user</>;

  return (
    <div className="flex flex-col gap-8">
      <WalletsList userId={user.id} wallets={wallets} />

      <RecentTransactions
        transactions={transactions}
        userId={user.id}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
};
