import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { updateTransaction } from "@/features/transactions/handlers/updateTransaction";
import { useTransactionCategories } from "@/features/transactions/hooks/useTransactionCategories";
import { createTransactionSchema } from "@/features/transactions/transactions.schema";
import type { NewTransaction, TransactionWithCategory } from "@/features/transactions/transactions.types";
import { TRANSACTION_TYPES } from "@/features/transactions/transactions.types";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { queryClient } from "@/lib/queryClient";
import { toFormattedTitleCase } from "@/utils/toFormattedTitleCase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface UpdateTransactionProps {
  transaction: TransactionWithCategory;
  onClose: () => void;
  isOpen: boolean;
}

export const UpdateTransaction = ({ transaction, onClose, isOpen }: UpdateTransactionProps) => {
  const { data: wallets } = useWallets();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewTransaction>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      ...transaction,
      date: new Date(transaction.date),
      description: transaction.description ?? "",
    },
  });

  const transactionType = watch("type");

  const { data: transactionCategories } = useTransactionCategories(transaction.userId, transactionType);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: NewTransaction) => {
      await updateTransaction(transaction.id, {
        ...payload,
        amount: payload.amount.replace(/,/g, ""), // Strip commas before submitting
        userId: transaction.userId,
      });
    },
    onSuccess: () => {
      toast.success("Transaction updated");
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      reset();
      onClose();
    },
    onError: (err) => {
      if (err instanceof Error) return toast.error(err.message);
      return toast.error("Something went wrong. Update Transaction Failed");
    },
  });

  const onSubmit: SubmitHandler<NewTransaction> = (values) => {
    mutate(values);
  };

  return (
    <Dialog close={onClose} isOpen={isOpen} title="Update Transaction">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-4 gap-2">
        <Input label="Name" {...register("name")} formError={errors.name} containerClassName="col-span-4" />

        <Select label="Wallet" {...register("walletId")} formError={errors.walletId} containerClassName="col-span-3">
          {wallets?.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name}
            </option>
          ))}
        </Select>

        <Input label="Amount" {...register("amount")} formError={errors.amount} containerClassName="col-span-2" />

        <Select label="type" {...register("type")} formError={errors.type} containerClassName="col-span-2">
          {TRANSACTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {toFormattedTitleCase(type)}
            </option>
          ))}
        </Select>

        <Select
          label="Category"
          {...register("categoryId")}
          formError={errors.categoryId}
          containerClassName="col-span-2"
        >
          {transactionCategories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <div className="col-span-2">
              <label className="text-sm/6 font-medium text-textSecondary">Date</label>
              <DatePicker
                selected={field.value}
                onChange={(date: Date | null) => field.onChange(date)}
                dateFormat="MMM/dd/yyyy"
                className={clsx(
                  "col-span-2 mt-0.5 block w-full rounded border-2 px-4 py-1.5 text-sm/6 outline-none transition-all focus:border-primary",
                  errors.date ? "border-error hover:border-error" : "border-gray-200 hover:border-primary",
                )}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>
          )}
        />

        <Input
          label="Description"
          {...register("description")}
          formError={errors.description}
          containerClassName="col-span-4"
        />

        <Button
          type="submit"
          disabled={isPending}
          className="col-span-4 mx-auto mt-2 bg-primary px-10 font-semibold text-white"
        >
          Update
        </Button>
      </form>
    </Dialog>
  );
};
