import { Button } from "@/components/ui/Button";
import { logoutUser } from "@/features/auth/handlers/logoutUser";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const Dashboard = () => {
  const { handleSetUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    handleSetUser(null);
  };

  return (
    <>
      I am dashboard
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};
