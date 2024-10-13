import { useAuth } from "@/features/auth/hooks/useAuth";
import { Suspense, useState } from "react";
import { lazily } from "react-lazily";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate } from "react-router-dom";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { Button } from "@/components/ui/Button";
import type { TimeRangeType } from "@/features/users/users.types";
import { FaChevronDown } from "react-icons/fa";
import { timeRangeOptions } from "@/features/transactions/transactions.data";

const { WalletsList, WalletListLoadingSkeleton } = lazily(() => import("@/features/wallets/components/WalletsList"));
const { RecentTransactions } = lazily(() => import("@/features/transactions/components/RecentTransactions"));
const { UserSummary } = lazily(() => import("@/features/users/components/UserSummary"));

export const Dashboard = () => {
  const { user } = useAuth();

  const [timeRangeType, setTimeRangeType] = useState<TimeRangeType>("thisMonth");

  const { close: closeCreateWallet, isOpen: isCreateWalletOpen, open: openCreateWallet } = useToggle();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="flex flex-col gap-8">
      <section id="wallets">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-md font-semibold text-textSecondary">Wallets</h2>

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
          <h2 className="text-md flex-1 font-semibold text-textSecondary">Summary</h2>

          <div className="relative">
            <select
              onChange={(e) => setTimeRangeType(e.target.value as TimeRangeType)}
              defaultValue={timeRangeType}
              className={
                "mt-1 block w-[150px] appearance-none rounded border-2 border-primary bg-white px-4 py-1.5 text-xs font-semibold text-primary outline-none hover:border-primary focus:border-primary"
              }
            >
              {timeRangeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <FaChevronDown
              className="group pointer-events-none absolute right-2.5 top-3.5 size-3 fill-primary"
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

      <ErrorBoundary fallback={<>Unable to load Transactions List</>}>
        <Suspense fallback={<>Loading Transactions...</>}>
          <RecentTransactions userId={user.id} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
