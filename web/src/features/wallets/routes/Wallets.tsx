import { useAuth } from "@/features/auth/hooks/useAuth";
import { WalletsList } from "@/features/wallets/components/WalletsList";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { Navigate } from "react-router-dom";

export const Wallets = () => {
  const { user } = useAuth();

  const { data: wallets } = useWallets();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <>
      <p>This is wallets</p>
      <WalletsList userId={user.id} wallets={wallets} />
    </>
  );
};
