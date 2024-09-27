import { useToggle } from "@/features/misc/hooks/useToggle";
import { DeleteWallet } from "@/features/wallets/components/DeleteWallet";
import { UpdateWallet } from "@/features/wallets/components/UpdateWallet";
import { WalletCard } from "@/features/wallets/components/WalletCard";
import { useWallet } from "@/features/wallets/hooks/useWallet";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const SingleWallet = () => {
  const { walletId } = useParams();
  const { data: wallet } = useWallet(walletId as string);

  const { close: closeUpdateDialog, open: openUpdateDialog, isOpen: isUpdateDialogOpen } = useToggle();
  const { close: closeDeleteDialog, open: openDeleteDialog, isOpen: isDeleteDialogOpen } = useToggle();

  if (!wallet) return <p>wallet data not found</p>;

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
                Edit
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

          <UpdateWallet close={closeUpdateDialog} isOpen={isUpdateDialogOpen} wallet={wallet} />
          <DeleteWallet close={closeDeleteDialog} isOpen={isDeleteDialogOpen} wallet={wallet} />
        </Menu>
      </div>

      <section>
        <WalletCard wallet={wallet} showDescription />
      </section>
    </>
  );
};
