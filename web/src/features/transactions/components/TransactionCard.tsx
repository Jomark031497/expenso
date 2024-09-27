import type { Transaction } from "@/features/transactions/transactions.types";
import { toCurrency } from "@/utils/toCurrency";
import { toFormattedDate } from "@/utils/toFormattedDate";
import { toFormattedTitleCase } from "@/utils/toFormattedTitleCase";
import clsx from "clsx";

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  return (
    <div className="grid grid-cols-3 border-2 border-dotted bg-white p-2 shadow">
      <p className="col-span-2 text-sm font-semibold">{transaction.name}</p>
      <p
        className={clsx(
          "col-span-1 text-end text-sm font-semibold",
          transaction.type === "income" ? "text-success" : "text-error",
        )}
      >
        {toCurrency(parseInt(transaction.amount))}
      </p>
      <p className="col-span-2 text-sm italic">{toFormattedTitleCase(transaction.category)}</p>
      <p className="col-span-1 text-end text-sm">{toFormattedDate(transaction.date)}</p>
      <p className="col-span-2 text-sm">{transaction.wallet.name}</p>
      <p className="col-span-1 text-end text-sm">{toFormattedTitleCase(transaction.wallet.type)}</p>
    </div>
  );
};
