import { useToggle } from "@/features/misc/hooks/useToggle";
import { DeleteTransaction } from "@/features/transactions/components/DeleteTransaction";
import { TransactionCard } from "@/features/transactions/components/TransactionCard";
import { UpdateTransaction } from "@/features/transactions/components/UpdateTransaction";
import { useSingleTransaction } from "@/features/transactions/hooks/useSingleTransaction";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaChevronDown, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useParams } from "react-router-dom";

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

          <UpdateTransaction isOpen={isUpdateDialogOpen} onClose={closeUpdateDialog} transaction={transaction} />

          <DeleteTransaction onClose={closeDeleteDialog} isOpen={isDeleteDialogOpen} transaction={transaction} />
        </Menu>
      </div>

      <section>
        <TransactionCard transaction={transaction} />
      </section>
    </>
  );
};
