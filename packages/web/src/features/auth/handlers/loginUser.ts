import { __API_URL__ } from "@/config/constants";
import type { LoginUser } from "@/features/auth/routes/Login";
import type { User } from "@/features/users/users.types";

export const loginUser = async (payload: LoginUser) => {
  const url = new URL("/api/auth/login", __API_URL__);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data as User;
};
