import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { deleteWallet } from "@/features/wallets/handlers/deleteWallet";
import type { Wallet } from "@/features/wallets/wallets.types";
import { queryClient } from "@/lib/queryClient";
import { toCurrency } from "@/utils/toCurrency";
import { toFormattedTitleCase } from "@/utils/toFormattedTitleCase";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface DeleteWalletProps {
  wallet: Wallet;
  close: () => void;
  isOpen: boolean;
}

export const DeleteWallet = ({ wallet, isOpen, close }: DeleteWalletProps) => {
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
      <p>Are you sure you want to delete wallet:</p>

      <ul>
        <li>{wallet.name}</li>
        <li>{toFormattedTitleCase(wallet.type)}</li>
        <li>{wallet.description}</li>
        <li>{toCurrency(parseInt(wallet.balance))}</li>
      </ul>

      <Button onClick={handleDeleteWallet}>Delete</Button>
    </Dialog>
  );
};
