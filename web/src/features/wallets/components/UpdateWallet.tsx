import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { updateWallet } from "@/features/wallets/handlers/updateWallet";
import type { Wallet } from "@/features/wallets/wallets.types";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface UpdateWalletProps {
  isOpen: boolean;
  close: () => void;
  wallet: Wallet;
}

const updateWalletSchema = z.object({
  name: z.string().min(3),
  type: z.enum(["cash", "credit_card", "debit_card"]),
  balance: z.string().refine((val) => /^[0-9,]+(\.[0-9]{1,2})?$/.test(val), {
    message: "Balance must be a number with optional commas and up to 2 decimal places",
  }),
  description: z.string().optional(),
});

export type NewWallet = z.infer<typeof updateWalletSchema>;

export const UpdateWallet = ({ isOpen, close, wallet: walletData }: UpdateWalletProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<NewWallet>({
    resolver: zodResolver(updateWalletSchema),
    defaultValues: {
      ...walletData,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: NewWallet) =>
      await updateWallet(walletData.id, {
        ...payload,
        balance: payload.balance.replace(/,/g, ""), // Strip commas before submitting
      }),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("wallet successfully updated");
      close();
    },
    onError: (err) => {
      if (err instanceof Error) return toast.error(err.message);
      return toast.error("Something went wrong. Update Wallet Failed");
    },
  });

  const onSubmit: SubmitHandler<NewWallet> = async (values) => {
    mutate(values);
  };

  return (
    <Dialog isOpen={isOpen} close={close} title="Update Wallet">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" {...register("name")} formError={errors.name} />
        <Select label="Type" formError={errors.type} {...register("type")}>
          <option value="cash">Cash</option>
          <option value="debit_card">Debit Card</option>
          <option value="credit_card">Credit Card</option>
        </Select>

        <Input
          label="Balance"
          disabled
          className="bg-gray-100 hover:border-transparent"
          {...register("balance")}
          formError={errors.balance}
        />

        <Input label="Description" {...register("description")} formError={errors.description} />

        <Button type="submit" disabled={isPending} className="mt-2 w-20 self-center bg-primary text-white">
          Create
        </Button>
      </form>
    </Dialog>
  );
};
