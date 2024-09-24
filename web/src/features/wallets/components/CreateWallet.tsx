import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createWallet } from "@/features/wallets/handlers/createWallet";
import type { Wallet } from "@/features/wallets/wallets.types";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CreateWalletProps {
  isOpen: boolean;
  close: () => void;
  userId: Wallet["userId"];
}

const createWalletSchema = z.object({
  name: z.string().min(3),
  type: z.enum(["cash", "credit_card", "debit_card"]),
  balance: z.string().refine((val) => /^[0-9,]+(\.[0-9]{1,2})?$/.test(val), {
    message: "Balance must be a number with optional commas and up to 2 decimal places",
  }),
  description: z.string().optional(),
});

export type NewWallet = z.infer<typeof createWalletSchema>;

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
      queryClient.invalidateQueries({
        queryKey: ["wallets"],
      });
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

        <Button type="submit" disabled={isPending} className="bg-primary mt-2 w-full max-w-xs self-center text-white">
          Create
        </Button>
      </form>
    </Dialog>
  );
};
