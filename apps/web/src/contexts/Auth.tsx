import { getAuthenticatedUser } from "@/features/auth/handlers/getAuthenticatedUser";
import type { User } from "@/features/users/users.types";
import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export interface AuthContextType {
  user: User | null;
  handleSetUser: (payload: User) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthContextProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleSetUser = (value: User) => setUser(value);

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

  return <AuthContext.Provider value={{ user, handleSetUser }}>{!isInitialLoading && <Outlet />}</AuthContext.Provider>;
};
