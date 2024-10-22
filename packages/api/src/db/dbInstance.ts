import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { envs } from "../config/env.js";
import { logger } from "../utils/logger.js";
import * as users from "../domains/users/users.schema.js";
import * as wallets from "../domains/wallets/wallets.schema.js";
import * as transactions from "../domains/transactions/transactions.schema.js";

const sql = postgres(envs.DATABASE_URL, {
  max: 10, // Set max connections in the pool
  idle_timeout: 300, // 300 seconds idle time
});

export const db = drizzle(sql, {
  schema: {
    ...users,
    ...wallets,
    ...transactions,
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
