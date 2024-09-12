import { __SERVER_URL__ } from "../../../config/constants";
import type { User } from "../../users/users.types";
import type { SignUpUser } from "../auth.types";

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
