import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  githubId: integer("github_id").unique(),
  discordId: varchar("discord_id").unique(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  email: varchar("email", { length: 256 }).unique(),
  password: varchar("password", { length: 256 }),
  fullName: varchar("full_name", { length: 256 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(users),
}));

export const selectUserSchema = createSelectSchema(users);

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

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
