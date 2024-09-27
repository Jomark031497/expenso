import { __SERVER_URL__ } from "@/config/constants";

export const createTransaction = async (payload) => {
  const url = new URL("/api/transactions", __SERVER_URL__);

  await fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSO,
  });
};
