import { __SERVER_URL__ } from "@/config/constants";
import type { SignUpUser } from "@/features/auth/auth.types";
import type { User } from "@/features/users/users.types";

export const signUpUser = async (payload: SignUpUser) => {
  const url = new URL("/api/auth/sign-up", __SERVER_URL__);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("sign up failed");

  const data = await response.json();

  if (!data) throw new Error(data.message);

  return data as User;
};
