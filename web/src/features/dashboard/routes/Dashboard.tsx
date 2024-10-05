import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { Link, Navigate } from "react-router-dom";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { WalletCard } from "@/features/wallets/components/WalletCard";
import { usePagination } from "@/features/misc/hooks/usePagination";
import { RecentTransactions } from "@/features/transactions/components/RecentTransactions";

export const Dashboard = () => {
  const { data: wallets } = useWallets();
  const { pagination, onPaginationChange } = usePagination();
  const { data: transactions } = useTransactions(pagination);
  const { user } = useAuth();

  const { close: closeCreateWallet, isOpen: isCreateWalletOpen, open: openCreateWallet } = useToggle();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="flex flex-col gap-8">
      <section id="wallets">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-md font-semibold text-textSecondary">Wallets</h2>

          <button
            onClick={openCreateWallet}
            className="rounded border border-primary p-2 py-1.5 text-xs font-semibold text-primary outline-none"
          >
            Create Wallet
          </button>

          <CreateWallet isOpen={isCreateWalletOpen} close={closeCreateWallet} userId={user.id} />
        </div>

        <div className="rounded border-2 py-2 shadow">
          <ul className="flex max-h-80 flex-col gap-1.5 overflow-y-auto px-2">
            {wallets?.map((wallet) => (
              <li key={wallet.id}>
                <Link to={`/wallets/${wallet.id}`}>
                  <WalletCard wallet={wallet} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RecentTransactions
        transactions={transactions}
        userId={user.id}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
};
