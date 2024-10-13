import type { Transaction } from "@/features/transactions/transactions.types";
import { toCurrency } from "@/utils/toCurrency";
import { toFormattedDate } from "@/utils/toFormattedDate";
import { toFormattedTitleCase } from "@/utils/toFormattedTitleCase";
import clsx from "clsx";
import { Link } from "react-router-dom";

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  return (
    <Link
      to={`/transactions/${transaction.id}`}
      className="grid grid-cols-3 border-2 border-dotted border-gray-300 bg-white p-2 shadow"
    >
      <p className="col-span-2 text-sm font-semibold">{transaction.name}</p>
      <p
        className={clsx(
          "col-span-1 text-end text-sm font-semibold",
          transaction.type === "income" ? "text-success" : "text-error",
        )}
      >
        {toCurrency(parseInt(transaction.amount))}
      </p>
      <p className="col-span-2 text-xs italic">{toFormattedTitleCase(transaction.category)}</p>
      <p className="col-span-1 text-end text-xs">{toFormattedDate(transaction.date)}</p>
      <p className="col-span-2 text-xs">{transaction.wallet.name}</p>
      <p className="col-span-1 text-end text-xs">{toFormattedTitleCase(transaction.wallet.type)}</p>
    </Link>
  );
};

export const TransactionCardSkeleton = () => {
  return <div role="status" className="min-h-[72px] animate-pulse border-2 bg-gray-300 p-2"></div>;
};
