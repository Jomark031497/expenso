import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env.js";
import * as users from "../domains/users/users.schema.js";
import { logger } from "../utils/logger.js";

const sql = postgres(env.DATABASE_URL, {
  max: 10, // Set max connections in the pool
  idle_timeout: 300, // 300 seconds idle time
});

export const db = drizzle(sql, {
  schema: {
    ...users,
  },
});

// Gracefully close the database connection
export const closeDbConnection = async () => {
  try {
    await sql.end();
    logger.info("Database connection closed.");
  } catch (error) {
    logger.error("Error closing database connection:", error);
  }
};
