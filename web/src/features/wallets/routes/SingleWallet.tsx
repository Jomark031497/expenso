import { useToggle } from "@/features/misc/hooks/useToggle";
import { WalletCard } from "@/features/wallets/components/WalletCard";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { Navigate, useParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { lazily } from "react-lazily";
import { useSingleWallet } from "@/features/wallets/hooks/useSingleWallet";
import type { Wallet } from "@/features/wallets/wallets.types";
import { DeleteWallet } from "@/features/wallets/components/DeleteWallet";
import { UpdateWallet } from "@/features/wallets/components/UpdateWallet";

const { RecentTransactions } = lazily(() => import("@/features/transactions/components/RecentTransactions"));

export const SingleWallet = () => {
  const { walletId: walletIdParams } = useParams();
  const walletId = walletIdParams ?? "";

  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <>
      <ErrorBoundary fallback={<>Unable to load Wallet Info</>}>
        <Suspense
          fallback={
            <div>
              <p>Loading wallet info</p>
            </div>
          }
        >
          <WalletInfo walletId={walletId} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<>Unable to load Transactions List</>}>
        <Suspense fallback={<>Loading Transactions...</>}>
          <RecentTransactions defaultWalletId={walletId} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

interface WalletInfoProps {
  walletId: Wallet["id"];
}

const WalletInfo = ({ walletId }: WalletInfoProps) => {
  const { data: wallet } = useSingleWallet(walletId);

  const { close: closeUpdateDialog, open: openUpdateDialog, isOpen: isUpdateDialogOpen } = useToggle();
  const { close: closeDeleteDialog, open: openDeleteDialog, isOpen: isDeleteDialogOpen } = useToggle();

  return (
    <section id="wallet" className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-md font-semibold text-textSecondary">Wallet Info</h2>

        <Menu>
          <MenuButton className="flex items-center gap-2 rounded border border-primary px-3 py-1.5 text-xs font-semibold text-primary">
            Options
            <FaChevronDown className="fill-primary" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-40 origin-top-right rounded border bg-white p-2 text-xs shadow transition duration-100 ease-out [--anchor-gap:4px] data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              <button
                onClick={openUpdateDialog}
                className="group flex w-full items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20"
              >
                <FaRegEdit className="text-base" />
                Update
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={openDeleteDialog}
                className="group flex w-full items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20"
              >
                <MdDelete className="text-base" />
                Delete
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>

        <UpdateWallet close={closeUpdateDialog} isOpen={isUpdateDialogOpen} walletId={walletId} />
        <DeleteWallet close={closeDeleteDialog} isOpen={isDeleteDialogOpen} walletId={walletId} />
      </div>

      <WalletCard wallet={wallet} showDescription />
    </section>
  );
};
