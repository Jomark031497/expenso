import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { deleteTransaction } from "@/features/transactions/handlers/deleteTransaction";
import type { Transaction } from "@/features/transactions/transactions.types";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface DeleteTransactionProps {
  transaction: Transaction;
  onClose: () => void;
  isOpen: boolean;
}

export const DeleteTransaction = ({ isOpen, onClose, transaction }: DeleteTransactionProps) => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (id: Transaction["id"]) => await deleteTransaction(id),
    onSuccess: () => {
      toast.success("transaction deleted.");
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      navigate(-1);
    },
  });

  const handleDeleteTransaction = () => {
    mutation.mutate(transaction.id);
  };

  return (
    <Dialog close={onClose} isOpen={isOpen} title="Delete Transaction">
      <form onSubmit={handleDeleteTransaction} className="flex flex-col gap-4">
        <p className="text-center">Are you sure you want to delete transaction: </p>
        <p className="text-center text-sm font-semibold">{transaction.name}</p>

        <p className="rounded bg-error/20 p-2 text-center text-sm italic text-error">You cannot undo this action.</p>

        <Button onClick={handleDeleteTransaction} className="w-20 self-center bg-error font-semibold text-white">
          Delete
        </Button>
      </form>
    </Dialog>
  );
};
