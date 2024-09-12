import { __SERVER_URL__ } from "../../../config/constants";
import type { User } from "../../users/users.types";
import type { LoginUser } from "../auth.types";

export const loginUser = async (payload: LoginUser) => {
  const url = new URL("/api/auth/login", __SERVER_URL__);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("login failed");

  const data = await response.json();

  if (!data) throw new Error(data.message);

  return data as User;
};
