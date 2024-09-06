import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env.js";
import * as users from "../domains/users/users.schema.js";

const sql = postgres(env.DATABASE_URL);

export const db = drizzle(sql, {
  schema: {
    ...users,
  },
});

export const closeDbConnection = async () => {
  await sql.end();
};
