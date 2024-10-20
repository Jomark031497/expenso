import { Argon2id } from "oslo/password";
import { AppError } from "../../utils/appError.js";
import { excludeFields } from "../../utils/excludeFields.js";
import type { NewUser, User } from "../users/users.schema.js";
import { createUser, getUser } from "../users/users.service.js";

export const signUpUser = async (payload: NewUser) => {
  const user = await createUser({
    ...payload,
    role: "user",
  });

  return user;
};

export const getAuthenticatedUser = async (id: User["id"]) => {
  return await getUser("id", id, {
    returnError: true,
  });
};

export const loginUser = async (payload: Pick<User, "username" | "password">) => {
  const user = await getUser("username", payload.username, {
    includePassword: true,
    returnError: false,
  });
  if (!user) throw new AppError(404, "invalid username/password");

  if (payload.password && user.password) {
    const isPasswordValid = await new Argon2id().verify(user.password, payload.password);
    if (!isPasswordValid) throw new AppError(404, "invalid username/password");
  }

  return excludeFields(user, ["password"]);
};
