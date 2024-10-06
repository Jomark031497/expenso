import { useToggle } from "@/features/misc/hooks/useToggle";
import type { User } from "@/features/users/users.types";
import { CreateWallet } from "@/features/wallets/components/CreateWallet";
import { WalletCard } from "@/features/wallets/components/WalletCard";
import type { Wallet } from "@/features/wallets/wallets.types";
import { Link } from "react-router-dom";

interface WalletsListProps {
  userId: User["id"];
  wallets?: Wallet[];
}

export const WalletsList = ({ userId, wallets }: WalletsListProps) => {
  const { close, isOpen, open } = useToggle();

  if (!wallets) return <>NO WALLETS</>;

  return (
    <section id="wallets">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-md font-semibold text-textSecondary">Wallets</h2>

        <button
          onClick={open}
          className="rounded border border-primary p-2 py-1.5 text-xs font-semibold text-primary outline-none"
        >
          Create Wallet
        </button>

        <CreateWallet isOpen={isOpen} close={close} userId={userId} />
      </div>

      <div className="rounded border-2 py-2 shadow">
        <ul className="flex max-h-80 flex-col gap-1.5 overflow-y-auto px-2">
          {wallets.map((wallet) => (
            <li key={wallet.id}>
              <Link to={`/wallets/${wallet.id}`}>
                <WalletCard wallet={wallet} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
