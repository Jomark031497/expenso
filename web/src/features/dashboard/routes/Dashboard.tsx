import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { Link, Navigate } from "react-router-dom";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { WalletCard } from "@/features/wallets/components/WalletCard";
import { TransactionCard } from "@/features/transactions/components/TransactionCard";
import { Pagination } from "@/features/misc/components/Pagination";
import { usePagination } from "@/features/misc/hooks/usePagination";
import { CreateTransaction } from "@/features/transactions/components/CreateTransaction";

export const Dashboard = () => {
  const { data: wallets } = useWallets();
  const { pagination, onPaginationChange } = usePagination();
  const { data: transactions } = useTransactions(pagination);
  const { user } = useAuth();

  const { close: closeCreateWallet, isOpen: isCreateWalletOpen, open: openCreateWallet } = useToggle();
  const { close: closeCreateTransaction, isOpen: isCreateTransactionOpen, open: openCreateTransaction } = useToggle();

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

      <section id="recent-transactions">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-md font-semibold text-textSecondary">Recent Transactions</h2>

          <button
            onClick={openCreateTransaction}
            className="rounded border border-primary p-2 py-1.5 text-xs font-semibold text-primary outline-none"
          >
            Create Transaction
          </button>

          <CreateTransaction isOpen={isCreateTransactionOpen} onClose={closeCreateTransaction} userId={user.id} />
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
    </div>
  );
};
