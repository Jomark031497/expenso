import { __API_URL__ } from "@/config/constants";
import type { User } from "@/features/users/users.types";

export const getAuthenticatedUser = async () => {
  const url = new URL("/api/auth/user", __API_URL__);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as User;
};
