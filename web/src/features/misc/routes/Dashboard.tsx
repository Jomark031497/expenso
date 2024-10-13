import { useAuth } from "@/features/auth/hooks/useAuth";
import { Suspense } from "react";
import { lazily } from "react-lazily";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate } from "react-router-dom";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { Button } from "@/components/ui/Button";

const { WalletsList, WalletListLoadingSkeleton } = lazily(() => import("@/features/wallets/components/WalletsList"));
const { RecentTransactions } = lazily(() => import("@/features/transactions/components/RecentTransactions"));
const { UserSummary } = lazily(() => import("@/features/users/components/UserSummary"));

export const Dashboard = () => {
  const { user } = useAuth();

  const { close: closeCreateWallet, isOpen: isCreateWalletOpen, open: openCreateWallet } = useToggle();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="flex flex-col gap-8">
      <section>
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

      <ErrorBoundary fallback={<>Unable to load User Summary</>}>
        <Suspense fallback={<>Loading User Summary...</>}>
          <UserSummary />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<>Unable to load Transactions List</>}>
        <Suspense fallback={<>Loading Transactions...</>}>
          <RecentTransactions userId={user.id} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
