import { useContext } from "react";
import { AuthContext } from "../../../../contexts/Auth";

export const useAuth = () => {
  return useContext(AuthContext);
};
