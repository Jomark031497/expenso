import { Button } from "@/components/ui/Button";
import { useToggle } from "@/features/misc/hooks/useToggle";
import { UpdateWallet } from "@/features/wallets/components/UpdateWallet";
import { WalletCard } from "@/features/wallets/components/WalletCard";
import { deleteWallet } from "@/features/wallets/handlers/deleteWallet";
import { useWallet } from "@/features/wallets/hooks/useWallet";
import type { Wallet } from "@/features/wallets/wallets.types";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export const SingleWallet = () => {
  const { walletId } = useParams();
  const { data: wallet } = useWallet(walletId as string);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (id: Wallet["id"]) => await deleteWallet(id),
    onSuccess: () => {
      toast.success("wallet deleted.");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      navigate("/");
    },
  });

  const handleDeleteWallet = async (id: Wallet["id"]) => {
    mutation.mutate(id);
  };

  const { close: closeUpdateDialog, open: openUpdateDialog, isOpen: isUpdateDialogOpen } = useToggle();

  if (!wallet) return <p>wallet data not found</p>;
  return (
    <>
      <section>
        <WalletCard wallet={wallet} />
      </section>

      <div>
        <Button onClick={async () => await handleDeleteWallet(wallet.id)}>Delete</Button>
        <Button onClick={openUpdateDialog}>Update</Button>

        <UpdateWallet close={closeUpdateDialog} isOpen={isUpdateDialogOpen} walletData={wallet} />
      </div>
    </>
  );
};
