import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { toCurrency } from "@/utils/toCurrency";
import { Link, Navigate } from "react-router-dom";
import { FaCreditCard, FaMoneyCheck, FaMoneyBillWave } from "react-icons/fa";

export const Dashboard = () => {
  const { data } = useWallets();
  const { user } = useAuth();

  const { close, isOpen, open } = useToggle();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-textSecondary">Wallets</h2>

          <Button onClick={open} className="bg-primary font-semibold text-white hover:bg-primary/90">
            Create Wallet
          </Button>

          <CreateWallet isOpen={isOpen} close={close} userId={user.id} />
        </div>

        <ul className="flex h-80 flex-col gap-2 overflow-y-auto rounded border p-2 text-white shadow">
          {data?.map((wallet) => (
            <li key={wallet.id} className="max-w-md flex-1 rounded-lg bg-gradient-to-r from-[#ED5635] to-[#F57002] p-2">
              <Link to={`/wallets/${wallet.id}`}>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-white p-2 text-black">
                    {wallet.type === "cash" ? (
                      <FaMoneyBillWave />
                    ) : wallet.type === "credit_card" ? (
                      <FaCreditCard />
                    ) : (
                      <FaMoneyCheck />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-semibold">{wallet.name}</p>
                    <p className="text-xs">
                      {wallet.type
                        .toLowerCase()
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </p>
                  </div>
                </div>

                <p className="text-end text-xs">
                  {wallet.type === "credit_card" ? "Outstanding Balance" : "Available Balance"}
                </p>
                <p className="text-end text-sm font-semibold">{toCurrency(wallet.balance)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
