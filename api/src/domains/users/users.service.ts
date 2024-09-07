import { eq } from "drizzle-orm";
import type { NewUser, User } from "./users.schema.js";
import { users } from "./users.schema.js";
import { db } from "../../db/dbInstance.js";
import { AppError } from "../../utils/appError.js";
import { Argon2id } from "oslo/password";
import { excludeFields } from "../../utils/excludeFields.js";

export const getUsers = async () => {
  return await db.query.users.findMany({
    columns: {
      password: false,
    },
  });
};

export const getUser = async (
  field: keyof User,
  value: string,
  options: { includePassword?: boolean; returnError?: boolean } = { includePassword: true, returnError: true },
) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users[field], value),
    ...(!options.includePassword && {
      columns: {
        password: false,
      },
    }),
  });

  if (!user && (options.returnError ?? true)) {
    throw new AppError(404, `${field} not found`);
  }

  return user;
};

export const createUser = async (payload: NewUser) => {
  const usernameExists = await getUser("username", payload.username, { includePassword: false, returnError: false });
  const emailExists = await getUser("email", payload.email, { includePassword: false, returnError: false });

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

  return excludeFields(query[0], ["password"]);
};

export const updateUser = async (id: User["id"], payload: Partial<NewUser>) => {
  const existingUser = await getUser("id", id);
  if (!existingUser) throw new AppError(404, "update user failed. userId not found");

  if (payload.password) {
    payload.password = await new Argon2id().hash(payload.password);
  }

  if (payload.role && existingUser.role !== "admin") {
    throw new AppError(403, "You are not authorized to change user roles.");
  }

  await db
    .update(users)
    .set({
      ...payload, // Only update provided fields
    })
    .where(eq(users.id, id))
    .returning();

  return { message: "user successfully updated" };
};

export const deleteUser = async (id: User["id"]) => {
  const existingUser = await getUser("id", id);
  if (!existingUser) throw new AppError(404, "delete user failed. userId not found");

  await db.delete(users).where(eq(users.id, id)).returning();

  return { message: "user deleted successfully" };
};
