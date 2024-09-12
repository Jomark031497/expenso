import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { User } from "../features/users/users.types";

export interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthContextProvider = () => {
  const [user] = useState<User | null>({
    id: "12345",
    username: "doodles",
    email: "doodles@gmail.com",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <AuthContext.Provider value={{ user }}>
      <Outlet />
    </AuthContext.Provider>
  );
};
