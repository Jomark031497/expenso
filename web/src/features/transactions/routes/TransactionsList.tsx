import { useAuth } from "@/features/auth/hooks/useAuth";
import { lazily } from "react-lazily";

const { RecentTransactions } = lazily(() => import("@/features/transactions/components/RecentTransactions"));

export const TransactionsList = () => {
  const { user } = useAuth();

  if (!user) return <>no user</>;

  return (
    <>
      <p>This is Transactions List</p>
      <RecentTransactions userId={user.id} />
    </>
  );
};
