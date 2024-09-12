import { Argon2id } from "oslo/password";
import { lucia } from "../../lib/lucia.js";
import { AppError } from "../../utils/appError.js";
import { excludeFields } from "../../utils/excludeFields.js";
import type { NewUser, User } from "../users/users.schema.js";
import { createUser, getUser } from "../users/users.service.js";
import type { Session } from "lucia";

export const signUpUser = async (payload: NewUser) => {
  const user = await createUser({
    ...payload,
    role: "user",
  });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return {
    user: excludeFields(user, ["password"]),
    sessionCookie,
  };
};

export const getAuthenticatedUser = async (id: User["id"]) => {
  return await getUser("id", id, {
    includePassword: false,
    returnError: true,
  });
};

export const loginUser = async (payload: Pick<User, "username" | "password">) => {
  const user = await getUser("username", payload.username, {
    includePassword: true,
  });
  if (!user) throw new AppError(404, "invalid username/password");

  const isPasswordValid = await new Argon2id().verify(user.password, payload.password);
  if (!isPasswordValid) throw new AppError(404, "invalid username/password");

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return {
    user: excludeFields(user, ["password"]),
    sessionCookie,
  };
};

export const logoutUser = async (sessionId: Session["id"]) => {
  await lucia.invalidateSession(sessionId);
  return { message: "logout success" };
};
