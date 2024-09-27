import { Button } from "@/components/ui/Button";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { DeleteWallet } from "@/features/wallets/components/DeleteWallet";
import { UpdateWallet } from "@/features/wallets/components/UpdateWallet";
import { WalletCard } from "@/features/wallets/components/WalletCard";
import { useWallet } from "@/features/wallets/hooks/useWallet";
import { useParams } from "react-router-dom";

export const SingleWallet = () => {
  const { walletId } = useParams();
  const { data: wallet } = useWallet(walletId as string);

  const { close: closeUpdateDialog, open: openUpdateDialog, isOpen: isUpdateDialogOpen } = useToggle();
  const { close: closeDeleteDialog, open: openDeleteDialog, isOpen: isDeleteDialogOpen } = useToggle();

  if (!wallet) return <p>wallet data not found</p>;

  return (
    <>
      <div></div>

      <section>
        <WalletCard wallet={wallet} />
      </section>

      <div>
        <Button onClick={openDeleteDialog}>Delete</Button>
        <Button onClick={openUpdateDialog}>Update</Button>

        <UpdateWallet close={closeUpdateDialog} isOpen={isUpdateDialogOpen} wallet={wallet} />
        <DeleteWallet close={closeDeleteDialog} isOpen={isDeleteDialogOpen} wallet={wallet} />
      </div>
    </>
  );
};
