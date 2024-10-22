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
import { useTimeRangeType } from "@/features/wallets/hooks/useTimeRangeType";
import type { TimeRangeType } from "@/features/users/users.types";
import { Button } from "@/components/ui/Button";

const { RecentTransactions } = lazily(() => import("@/features/transactions/components/RecentTransactions"));
const { UserSummary } = lazily(() => import("@/features/users/components/UserSummary"));
const { CreateTransaction } = lazily(() => import("@/features/transactions/components/CreateTransaction"));

export const SingleWallet = () => {
  const { walletId: walletIdParams } = useParams();
  const walletId = walletIdParams ?? "";

  const { setTimeRangeType, timeRangeOptions, timeRangeType } = useTimeRangeType();
  const { user } = useAuth();

  const {
    close: closeCreateTransaction,
    isOpen: isOpenCreateTransactionOpen,
    open: openCreateTransaction,
  } = useToggle();

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

      <section id="summary" className="mb-8">
        <div className="mb-4 flex items-center justify-end">
          <h2 className="text-md flex-1 font-semibold text-textSecondary">Summary</h2>

          <div className="relative">
            <select
              onChange={(e) => setTimeRangeType(e.target.value as TimeRangeType)}
              defaultValue={timeRangeType}
              className={
                "mt-1 block w-[150px] appearance-none rounded border-2 border-primary bg-white px-4 py-1.5 text-xs font-semibold text-primary outline-none hover:border-primary focus:border-primary"
              }
            >
              {timeRangeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <FaChevronDown
              className="group pointer-events-none absolute right-2.5 top-3.5 size-3 fill-primary"
              aria-hidden="true"
            />
          </div>
        </div>

        <ErrorBoundary fallback={<>Unable to load User Summary</>}>
          <Suspense
            fallback={
              <div className="grid animate-pulse grid-cols-3 gap-2">
                <div className="col-span-1 h-[78px] rounded bg-gray-300 p-2"></div>
                <div className="col-span-1 h-[78px] rounded bg-gray-300 p-2"></div>
                <div className="col-span-1 h-[78px] rounded bg-gray-300 p-2"></div>
              </div>
            }
          >
            <UserSummary timeRangeType={timeRangeType} walletId={walletId} />
          </Suspense>
        </ErrorBoundary>
      </section>

      <section id="recent-transactions">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-md font-semibold text-textSecondary">Recent Transactions</h2>

          <Button variant="outlined" onClick={openCreateTransaction}>
            Create Transaction
          </Button>
        </div>
        <ErrorBoundary fallback={<>Unable to load Transactions List</>}>
          <Suspense fallback={<>Loading Transactions...</>}>
            <RecentTransactions defaultWalletId={walletId} />
            <CreateTransaction
              isOpen={isOpenCreateTransactionOpen}
              onClose={closeCreateTransaction}
              userId={user.id}
              defaultWalletId={walletId}
            />
          </Suspense>
        </ErrorBoundary>
      </section>
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
