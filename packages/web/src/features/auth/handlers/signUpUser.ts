import { __API_URL__ } from "@/config/constants";
import type { SignUpUser } from "@/features/auth/routes/SignUp";
import type { User } from "@/features/users/users.types";

export const signUpUser = async (payload: SignUpUser) => {
  const url = new URL("/api/auth/sign-up", __API_URL__);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data) {
    throw {
      message: data.message || "Sign Up failed",
      errors: data.errors || {},
    };
  }

  return data as User;
};
