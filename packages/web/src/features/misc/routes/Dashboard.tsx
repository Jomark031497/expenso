import { useAuth } from "@/features/auth/hooks/useAuth";
import { Suspense } from "react";
import { lazily } from "react-lazily";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate } from "react-router-dom";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { Button } from "@/components/ui/Button";
import type { TimeRangeType } from "@/features/users/users.types";
import { FaChevronDown } from "react-icons/fa";
import { useTimeRangeType } from "@/features/wallets/hooks/useTimeRangeType";

const { WalletsList, WalletListLoadingSkeleton } = lazily(() => import("@/features/wallets/components/WalletsList"));
const { RecentTransactions, RecentTransactionsSkeleton } = lazily(
  () => import("@/features/transactions/components/RecentTransactions"),
);
const { UserSummary } = lazily(() => import("@/features/users/components/UserSummary"));
const { CreateTransaction } = lazily(() => import("@/features/transactions/components/CreateTransaction"));

export const Dashboard = () => {
  const { user } = useAuth();

  const { setTimeRangeType, timeRangeOptions, timeRangeType } = useTimeRangeType();

  const { close: closeCreateWallet, isOpen: isCreateWalletOpen, open: openCreateWallet } = useToggle();
  const {
    close: closeCreateTransaction,
    isOpen: isOpenCreateTransactionOpen,
    open: openCreateTransaction,
  } = useToggle();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="flex flex-col gap-8">
      <section id="wallets">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-md text-textSecondary font-semibold">Wallets</h2>

          <Button variant="outlined" onClick={openCreateWallet}>
            Create Wallet
          </Button>

          <CreateWallet isOpen={isCreateWalletOpen} close={closeCreateWallet} userId={user.id} />
        </div>

        <ErrorBoundary fallback={<>Unable to load Wallet List</>}>
          <Suspense fallback={<WalletListLoadingSkeleton />}>
            <WalletsList />
          </Suspense>
        </ErrorBoundary>
      </section>

      <section id="summary">
        <div className="mb-4 flex items-center justify-end">
          <h2 className="text-md text-textSecondary flex-1 font-semibold">Summary</h2>

          <div className="relative">
            <select
              onChange={(e) => setTimeRangeType(e.target.value as TimeRangeType)}
              defaultValue={timeRangeType}
              className={
                "border-primary text-primary hover:border-primary focus:border-primary mt-1 block w-[150px] appearance-none rounded border-2 bg-white px-4 py-1.5 text-xs font-semibold outline-none"
              }
            >
              {timeRangeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <FaChevronDown
              className="fill-primary group pointer-events-none absolute right-2.5 top-3.5 size-3"
              aria-hidden="true"
            />
          </div>
        </div>

        <ErrorBoundary fallback={<>Unable to load User Summary</>}>
          <Suspense
            fallback={
              <div className="grid animate-pulse grid-cols-3 gap-2">
                <div className="col-span-1 h-[78px] rounded bg-gray-300 p-2"></div>
                <div className="col-span-1 h-[78px] rounded bg-gray-300 p-2"></div>
                <div className="col-span-1 h-[78px] rounded bg-gray-300 p-2"></div>
              </div>
            }
          >
            <UserSummary timeRangeType={timeRangeType} />
          </Suspense>
        </ErrorBoundary>
      </section>

      <section id="recent-transactions">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-md text-textSecondary font-semibold">Recent Transactions</h2>

          <Button variant="outlined" onClick={openCreateTransaction}>
            Create Transaction
          </Button>
        </div>

        <ErrorBoundary fallback={<>Unable to load Transactions List</>}>
          <Suspense fallback={<RecentTransactionsSkeleton />}>
            <RecentTransactions />
            <CreateTransaction isOpen={isOpenCreateTransactionOpen} onClose={closeCreateTransaction} userId={user.id} />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
};
