import { useToggle } from "@/features/misc/hooks/useToggle";
import { useSingleTransaction } from "@/features/transactions/hooks/useSingleTransaction";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FaChevronDown, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { lazily } from "react-lazily";
import { useParams } from "react-router-dom";

const { TransactionCard } = lazily(() => import("@/features/transactions/components/TransactionCard"));
const { UpdateTransaction } = lazily(() => import("@/features/transactions/components/UpdateTransaction"));
const { DeleteTransaction } = lazily(() => import("@/features/transactions/components/DeleteTransaction"));

export const SingleTransaction = () => {
  const { transactionId } = useParams();

  const { data: transaction } = useSingleTransaction(transactionId as string);

  const { close: closeUpdateDialog, isOpen: isUpdateDialogOpen, open: openUpdateDialog } = useToggle();
  const { close: closeDeleteDialog, isOpen: isDeleteDialogOpen, open: openDeleteDialog } = useToggle();

  if (!transaction) return null;

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

          <ErrorBoundary fallback={<>Unable to load Update Transaction Dialog</>}>
            <Suspense fallback={<>Loading Update Transaction Dialog</>}>
              <UpdateTransaction isOpen={isUpdateDialogOpen} onClose={closeUpdateDialog} transaction={transaction} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary fallback={<>Unable to load Delete Transaction Dialog</>}>
            <Suspense fallback={<>Loading Delete Transaction Dialog</>}>
              <DeleteTransaction onClose={closeDeleteDialog} isOpen={isDeleteDialogOpen} transaction={transaction} />
            </Suspense>
          </ErrorBoundary>
        </Menu>
      </div>

      <section>
        <ErrorBoundary fallback={<>Unable to load Transaction Card</>}>
          <Suspense fallback={<>Loading Transaction Card</>}>
            <TransactionCard transaction={transaction} />
          </Suspense>
        </ErrorBoundary>
      </section>
    </>
  );
};
