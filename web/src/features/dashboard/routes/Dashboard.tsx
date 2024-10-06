import { useAuth } from "@/features/auth/hooks/useAuth";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { usePagination } from "@/features/misc/hooks/usePagination";
import { lazily } from "react-lazily";
import { Suspense } from "react";
import { Navigate } from "react-router-dom";

const { WalletsList } = lazily(() => import("@/features/wallets/components/WalletsList"));
const { RecentTransactions } = lazily(() => import("@/features/transactions/components/RecentTransactions"));

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: wallets } = useWallets();

  const { pagination, onPaginationChange } = usePagination();
  const { data: transactions } = useTransactions(pagination);

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={<>Loading Wallets...</>}>
        <WalletsList userId={user.id} wallets={wallets} />
      </Suspense>

      <Suspense fallback={<>Loading Transactions...</>}>
        <RecentTransactions
          transactions={transactions}
          userId={user.id}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      </Suspense>
    </div>
  );
};
