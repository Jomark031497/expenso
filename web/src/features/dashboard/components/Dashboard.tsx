import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { toCurrency } from "@/utils/toCurrency";
import { Link, Navigate } from "react-router-dom";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { toFormattedDate } from "@/utils/toFormattedDate";
import { toFormattedTitleCase } from "@/utils/toFormattedTitleCase";
import clsx from "clsx";
import { WalletCard } from "@/features/wallets/components/WalletCard";

export const Dashboard = () => {
  const { data: wallets } = useWallets();
  const { data: transactions } = useTransactions();
  const { user } = useAuth();

  const { close, isOpen, open } = useToggle();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-textSecondary">Wallets</h2>

          <Button onClick={open} className="border border-primary font-semibold text-primary">
            Create Wallet
          </Button>

          <CreateWallet isOpen={isOpen} close={close} userId={user.id} />
        </div>

        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto rounded border p-4 shadow">
          {wallets?.map((wallet) => (
            <li key={wallet.id}>
              <Link to={`/wallets/${wallet.id}`}>
                <WalletCard wallet={wallet} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-textSecondary">Recent Transactions</h2>

          <Button onClick={open} className="bg-primaryDark font-semibold text-white hover:bg-primary/90">
            Create Transaction
          </Button>

          <CreateWallet isOpen={isOpen} close={close} userId={user.id} />
        </div>

        <ul className="rounded border p-4 shadow">
          {transactions?.map((transaction) => (
            <li key={transaction.id} className="grid grid-cols-3 border-2 border-dotted bg-white p-2 shadow">
              <p className="col-span-2 text-sm font-semibold">{transaction.name}</p>
              <p
                className={clsx(
                  "col-span-1 text-end text-sm",
                  transaction.type === "income" ? "text-success" : "text-error",
                )}
              >
                {toCurrency(parseInt(transaction.amount))}
              </p>
              <p className="col-span-2 text-sm italic">{toFormattedTitleCase(transaction.category)}</p>
              <p className="col-span-1 text-end text-sm">{toFormattedDate(transaction.date)}</p>
              <p className="col-span-2 text-sm">{transaction.wallet.name}</p>
              <p className="col-span-1 text-end text-sm">{toFormattedTitleCase(transaction.wallet.type)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
