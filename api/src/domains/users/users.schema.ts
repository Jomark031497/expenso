import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
  username: varchar("username", { length: 256 }),
});
