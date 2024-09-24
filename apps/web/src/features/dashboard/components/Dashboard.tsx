import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { toCurrency } from "@/utils/toCurrency";
import { Navigate } from "react-router-dom";

export const Dashboard = () => {
  const { data } = useWallets();
  const { user } = useAuth();

  const { close, isOpen, open } = useToggle();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-textSecondary text-lg font-semibold">Wallets</h2>

          <Button onClick={open} className="bg-primary hover:bg-primary/90 font-semibold text-white">
            Create Wallet
          </Button>

          <CreateWallet isOpen={isOpen} close={close} userId={user.id} />
        </div>

        <ul className="flex flex-col gap-2">
          {data?.map((wallet) => (
            <li key={wallet.id} className="rounded border p-2 shadow">
              <p className="text-sm">{wallet.name}</p>
              <p className="text-xs">{wallet.type}</p>
              <p className="text-end text-sm">{toCurrency(wallet.balance)}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
