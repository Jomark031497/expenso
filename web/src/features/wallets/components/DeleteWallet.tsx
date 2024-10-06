import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { deleteWallet } from "@/features/wallets/handlers/deleteWallet";
import { useWallet } from "@/features/wallets/hooks/useWallet";
import type { Wallet } from "@/features/wallets/wallets.types";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface DeleteWalletProps {
  walletId: Wallet["id"];
  close: () => void;
  isOpen: boolean;
}

export const DeleteWallet = ({ walletId, isOpen, close }: DeleteWalletProps) => {
  const { data: wallet } = useWallet(walletId);

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

  const handleDeleteWallet = () => {
    mutation.mutate(wallet.id);
  };

  return (
    <Dialog close={close} isOpen={isOpen} title="Delete Wallet">
      <form onSubmit={handleDeleteWallet} className="flex flex-col gap-4">
        <p className="text-center">Are you sure you want to delete wallet: </p>
        <p className="text-center text-sm font-semibold">{wallet.name}</p>

        <p className="rounded bg-error/20 p-2 text-center text-sm italic text-error">
          You cannot undo this action. All transactions related to this wallet will also be deleted
        </p>

        <Button onClick={handleDeleteWallet} className="w-20 self-center bg-error font-semibold text-white">
          Delete
        </Button>
      </form>
    </Dialog>
  );
};
