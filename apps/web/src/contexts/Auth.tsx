import { getAuthenticatedUser } from "@/features/auth/handlers/getAuthenticatedUser";
import { logoutUser } from "@/features/auth/handlers/logoutUser";
import type { User } from "@/features/users/users.types";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";

export interface AuthContextType {
  user: User | null;
  handleSetUser: (payload: User | null) => void;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthContextProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleSetUser = (value: User | null) => setUser(value);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Logout failed. Something went wrong");
    }
  };

  useEffect(() => {
    const checkAuthenicated = async () => {
      try {
        const userData = await getAuthenticatedUser();
        setUser(userData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Do Nothing
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkAuthenicated();
  }, []);

  return (
    <AuthContext.Provider value={{ user, handleSetUser, handleLogout }}>
      {!isInitialLoading && <Outlet />}
    </AuthContext.Provider>
  );
};
