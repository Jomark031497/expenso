import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/auth/login" />;
};
