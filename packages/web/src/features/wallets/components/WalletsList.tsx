import { WalletCard, WalletCardSkeleton } from "@/features/wallets/components/WalletCard";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { Link } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const WalletsList = () => {
  const { data: wallets } = useWallets();
  const [parent] = useAutoAnimate();

  if (!wallets.length)
    return (
      <div className="text-textSecondary py-4 text-center text-sm font-semibold italic">
        You currently have no wallets
      </div>
    );

  return (
    <div className="rounded border-2 py-2 shadow">
      <ul ref={parent} className="flex max-h-80 flex-col gap-1.5 overflow-y-auto px-2">
        {wallets.map((wallet) => (
          <li key={wallet.id}>
            <Link to={`/wallets/${wallet.id}`}>
              <WalletCard wallet={wallet} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const WalletListLoadingSkeleton = () => {
  return (
    <div className="rounded border-2 py-2 shadow">
      <ul className="flex max-h-80 flex-col gap-1.5 overflow-y-auto px-2">
        <WalletCardSkeleton />
        <WalletCardSkeleton />
        <WalletCardSkeleton />
      </ul>
    </div>
  );
};
