import { createId } from "@paralleldrive/cuid2";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const USER_ROLES = ["user", "admin"] as const;

export const rolesEnum = pgEnum("roles", USER_ROLES);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  username: varchar("username", { length: 256 }).notNull().unique(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  fullName: varchar("full_name", { length: 256 }),
  roles: rolesEnum("roles").default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users, {
  username: (schema) =>
    schema.username
      .trim()
      .min(3, "username must be atleast 3 characters long")
      .max(256, "username must not exceed 256 characters"),
  email: (schema) =>
    schema.email
      .trim()
      .email("please enter a valid email address")
      .max(256, "email must not exceed 256 characters long"),
  password: (schema) =>
    schema.password
      .trim()
      .min(6, "password must be atleast 6 characters long")
      .max(256, "password must not exceed 256 characters"),
  fullName: (schema) => schema.fullName.max(256, "fullName must not exceed 256 characters"),
});

export const selectUserSchema = createSelectSchema(users);

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
