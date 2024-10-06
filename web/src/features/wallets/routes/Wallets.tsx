import { useAuth } from "@/features/auth/hooks/useAuth";
import { WalletListLoadingSkeleton, WalletsList } from "@/features/wallets/components/WalletsList";
import { Suspense } from "react";
import { Navigate } from "react-router-dom";

export const Wallets = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <>
      <p>This is wallets</p>
      <Suspense fallback={<WalletListLoadingSkeleton />}>
        <WalletsList />
      </Suspense>
    </>
  );
};
