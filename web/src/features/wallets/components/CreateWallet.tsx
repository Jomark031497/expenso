import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createWallet } from "@/features/wallets/handlers/createWallet";
import { createWalletSchema } from "@/features/wallets/wallets.schema";
import type { NewWallet, Wallet } from "@/features/wallets/wallets.types";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface CreateWalletProps {
  isOpen: boolean;
  close: () => void;
  userId: Wallet["userId"];
}

export const CreateWallet = ({ isOpen, close, userId }: CreateWalletProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<NewWallet>({
    resolver: zodResolver(createWalletSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: NewWallet) =>
      await createWallet({
        ...payload,
        balance: payload.balance.replace(/,/g, ""), // Strip commas before submitting
        userId,
      }),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });

      toast.success("wallet successfully created");
      close();
    },
    onError: (err) => {
      if (err instanceof Error) return toast.error(err.message);
      return toast.error("Something went wrong. Create Wallet Failed");
    },
  });

  const onSubmit: SubmitHandler<NewWallet> = async (values) => {
    mutate(values);
  };

  return (
    <Dialog isOpen={isOpen} close={close} title="Create Wallet">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" {...register("name")} formError={errors.name} />
        <Select label="Type" formError={errors.type} {...register("type")}>
          <option value="cash">Cash</option>
          <option value="debit_card">Debit Card</option>
          <option value="credit_card">Credit Card</option>
        </Select>

        <Input label="Balance" {...register("balance")} formError={errors.balance} />

        <Input label="Description" {...register("description")} formError={errors.description} />

        <Button type="submit" disabled={isPending} className="mt-2 w-full max-w-xs self-center bg-primary text-white">
          Create
        </Button>
      </form>
    </Dialog>
  );
};
