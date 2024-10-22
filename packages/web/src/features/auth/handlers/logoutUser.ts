import { __SERVER_URL__ } from "@/config/constants";

export const logoutUser = async () => {
  const url = new URL("/api/auth/logout", __SERVER_URL__);

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
};
