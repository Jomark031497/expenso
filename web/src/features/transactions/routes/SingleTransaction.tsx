import { useToggle } from "@/features/misc/hooks/useToggle";
import { TransactionCard } from "@/features/transactions/components/TransactionCard";
import { UpdateTransaction } from "@/features/transactions/components/UpdateTransaction";
import { useSingleTransaction } from "@/features/transactions/hooks/useSingleTransaction";
import { useParams } from "react-router-dom";

export const SingleTransaction = () => {
  const { transactionId } = useParams();

  const { data: transaction } = useSingleTransaction(transactionId as string);

  const { close, isOpen, open } = useToggle();

  if (!transaction) return null;

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <button
          onClick={open}
          className="rounded border border-primary p-2 py-1.5 text-xs font-semibold text-primary outline-none"
        >
          Edit Transaction
        </button>

        <UpdateTransaction isOpen={isOpen} onClose={close} transaction={transaction} />
      </div>

      <section>
        <TransactionCard transaction={transaction} />
      </section>
    </>
  );
};
