import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env.js";

const sql = postgres(env.DATABASE_URL);

export const db = drizzle(sql);

export const closeDbConnection = async () => {
  await sql.end();
};
