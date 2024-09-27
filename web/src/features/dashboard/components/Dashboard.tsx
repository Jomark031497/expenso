import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { Link, Navigate } from "react-router-dom";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { WalletCard } from "@/features/wallets/components/WalletCard";
import { TransactionCard } from "@/features/transactions/components/TransactionCard";

export const Dashboard = () => {
  const { data: wallets } = useWallets();
  const { data: transactions } = useTransactions();
  const { user } = useAuth();

  const { close, isOpen, open } = useToggle();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="flex flex-col gap-8">
      <section id="wallets">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-textSecondary">Wallets</h2>

          <Button onClick={open} className="border border-primary font-semibold text-primary">
            Create Wallet
          </Button>

          <CreateWallet isOpen={isOpen} close={close} userId={user.id} />
        </div>

        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto rounded border p-2 shadow">
          {wallets?.map((wallet) => (
            <li key={wallet.id}>
              <Link to={`/wallets/${wallet.id}`}>
                <WalletCard wallet={wallet} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="recent-transactions">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-textSecondary">Recent Transactions</h2>

          <Button onClick={open} className="bg-primaryDark font-semibold text-white hover:bg-primary/90">
            Create Transaction
          </Button>

          <CreateWallet isOpen={isOpen} close={close} userId={user.id} />
        </div>

        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto rounded border p-4 shadow">
          {transactions?.map((transaction) => (
            <li key={transaction.id}>
              <TransactionCard transaction={transaction} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
