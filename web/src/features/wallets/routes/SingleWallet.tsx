import { useToggle } from "@/features/misc/hooks/useToggle";
import { WalletCard, WalletCardSkeleton } from "@/features/wallets/components/WalletCard";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { Navigate, useParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RecentTransactions } from "@/features/transactions/components/RecentTransactions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { lazily } from "react-lazily";

const { UpdateWallet } = lazily(() => import("@/features/wallets/components/UpdateWallet"));
const { DeleteWallet } = lazily(() => import("@/features/wallets/components/DeleteWallet"));

export const SingleWallet = () => {
  const { walletId: walletIdParams } = useParams();
  const walletId = walletIdParams as string;

  const { user } = useAuth();

  const { close: closeUpdateDialog, open: openUpdateDialog, isOpen: isUpdateDialogOpen } = useToggle();
  const { close: closeDeleteDialog, open: openDeleteDialog, isOpen: isDeleteDialogOpen } = useToggle();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <>
      <div className="mb-2 flex justify-end">
        <Menu>
          <MenuButton className="flex items-center gap-2 rounded border border-primary px-3 py-1.5 text-sm font-semibold text-primary">
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

          <ErrorBoundary fallback={<>Update Wallet failed</>}>
            <Suspense fallback={<>Loading Update Wallet...</>}>
              <UpdateWallet close={closeUpdateDialog} isOpen={isUpdateDialogOpen} walletId={walletId} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary fallback={<>Delete Wallet failed</>}>
            <Suspense fallback={<>Loading Delete Wallet...</>}>
              <DeleteWallet close={closeDeleteDialog} isOpen={isDeleteDialogOpen} walletId={walletId} />
            </Suspense>
          </ErrorBoundary>
        </Menu>
      </div>

      <section id="wallet" className="mb-8">
        <ErrorBoundary fallback={<>Unable to load Wallet</>}>
          <Suspense fallback={<WalletCardSkeleton />}>
            <WalletCard walletId={walletId} showDescription />
          </Suspense>
        </ErrorBoundary>
      </section>

      <ErrorBoundary fallback={<>Unable to load Transactions List</>}>
        <Suspense fallback={<>Loading Transactions...</>}>
          <RecentTransactions userId={user.id} defaultWalletId={walletId} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};
