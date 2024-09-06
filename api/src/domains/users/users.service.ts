import { eq } from "drizzle-orm";
import type { NewUser, User } from "./users.schema.js";
import { users } from "./users.schema.js";
import { db } from "../../db/dbInstance.js";
import { AppError } from "../../utils/appError.js";
import { Argon2id } from "oslo/password";

export const getUsers = async () => {
  return await db.query.users.findMany({
    columns: {
      password: false,
    },
  });
};

export const getUserById = async (id: User["id"], includePassword: boolean = true) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
    ...(!includePassword && {
      columns: {
        password: false,
      },
    }),
  });
};

const getUserByEmail = async (email: User["email"]) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
    columns: {
      password: false,
    },
  });
};

export const getUserByUsername = async (username: User["username"], includePassword: boolean = true) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
    ...(!includePassword && {
      columns: {
        password: false,
      },
    }),
  });
};

export const createUser = async (payload: NewUser) => {
  const usernameExists = await getUserByUsername(payload.username);
  const emailExists = await getUserByEmail(payload.email);

  const errors: Record<string, unknown> = {};

  if (usernameExists) errors.username = "username is already taken";
  if (emailExists) errors.email = "email is already taken";

  if (Object.keys(errors).length) throw new AppError(400, "user creation failed", errors);

  const hashedPassword = await new Argon2id().hash(payload.password);

  const query = await db
    .insert(users)
    .values({ ...payload, password: hashedPassword })
    .returning();

  if (!query[0]) throw new AppError(400, "user creation failed");

  return query[0];
};

export const updateUser = async (id: User["id"], payload: NewUser) => {
  const existingUser = await getUserById(id);
  if (!existingUser) throw new AppError(404, "update user failed. userId not found");

  await db
    .update(users)
    .set({
      ...existingUser,
      ...payload,
    })
    .where(eq(users.id, id))
    .returning();

  return { message: "user successfully updated" };
};

export const deleteUser = async (id: User["id"]) => {
  const existingUser = await getUserById(id);
  if (!existingUser) throw new AppError(404, "delete user failed. userId not found");

  await db.delete(users).where(eq(users.id, id)).returning();

  return { message: "user deleted successfully" };
};
