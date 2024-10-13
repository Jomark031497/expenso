import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createTransaction } from "@/features/transactions/handlers/createTransaction";
import type { NewTransaction, Transaction } from "@/features/transactions/transactions.types";
import { TRANSACTION_TYPES } from "@/features/transactions/transactions.types";
import type { User } from "@/features/users/users.types";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { queryClient } from "@/lib/queryClient";
import { toFormattedTitleCase } from "@/utils/toFormattedTitleCase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";
import { createTransactionSchema, TRANSACTION_CATEGORIES } from "@/features/transactions/transactions.schema";

interface CreateTransactionProps {
  userId: User["id"];
  onClose: () => void;
  isOpen: boolean;
  defaultWalletId?: Transaction["walletId"];
}

export const CreateTransaction = ({ userId, onClose, isOpen, defaultWalletId }: CreateTransactionProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<NewTransaction>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: { userId, date: new Date(), amount: "0.00", walletId: defaultWalletId },
  });

  const { data: wallets } = useWallets();

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: NewTransaction) =>
      await createTransaction({
        ...values,
        amount: values.amount.replace(/,/g, ""), // Strip commas before submitting
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["walletTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });

      toast.success("Transaction created successfully");
      reset();
      onClose();
    },
    onError: (err) => {
      if (err instanceof Error) return toast.error(err.message);
      return toast.error("Something went wrong. Create Transactin Failed");
    },
  });

  const onSubmit: SubmitHandler<NewTransaction> = (values) => {
    mutate(values);
  };

  return (
    <Dialog close={onClose} isOpen={isOpen} title="Create Transaction">
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

        <Select label="Category" {...register("category")} formError={errors.category} containerClassName="col-span-2">
          {TRANSACTION_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {toFormattedTitleCase(category)}
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
          Create
        </Button>
      </form>
    </Dialog>
  );
};
