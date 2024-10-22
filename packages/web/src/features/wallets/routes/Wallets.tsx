import { useAuth } from "@/features/auth/hooks/useAuth";
import { Suspense } from "react";
import { lazily } from "react-lazily";
import { Navigate } from "react-router-dom";

const { WalletsList } = lazily(() => import("@/features/wallets/components/WalletsList"));
export const Wallets = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <>
      <p>This is wallets</p>
      <Suspense fallback={<p>Loading Wallets List...</p>}>
        <WalletsList />
      </Suspense>
    </>
  );
};
