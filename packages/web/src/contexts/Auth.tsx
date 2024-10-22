import { getAuthenticatedUser } from "@/features/auth/handlers/getAuthenticatedUser";
import { loginUser } from "@/features/auth/handlers/loginUser";
import { logoutUser } from "@/features/auth/handlers/logoutUser";
import { signUpUser } from "@/features/auth/handlers/signUpUser";
import type { LoginUser } from "@/features/auth/routes/Login";
import type { SignUpUser } from "@/features/auth/routes/SignUp";
import type { User } from "@/features/users/users.types";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";

export interface AuthContextType {
  user: User | null;
  handleLogout: () => Promise<void>;
  handleLogin: (payload: LoginUser) => Promise<void>;
  handleSignUp: (payload: SignUpUser) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthContextProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleLogin = async (payload: LoginUser) => {
    try {
      const userData = await loginUser(payload);
      setUser(userData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed. Something went wrong.");
      }
    }
  };

  const handleSignUp = async (payload: SignUpUser) => {
    try {
      const userData = await signUpUser(payload);
      setUser(userData);
    } catch (error) {
      if (typeof error === "object") {
        throw error;
      } else {
        throw { message: "Sign Up failed. Something went wrong.", errors: {} };
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Logout failed. Something went wrong");
      }
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
    <AuthContext.Provider value={{ user, handleLogout, handleLogin, handleSignUp }}>
      {!isInitialLoading && <Outlet />}
    </AuthContext.Provider>
  );
};
