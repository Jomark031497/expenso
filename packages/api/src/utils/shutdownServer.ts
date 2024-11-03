import type { Server } from "http";
import { closeDbConnection } from "../db/dbInstance.js";
import { logger } from "./logger.js";

// Graceful shutdown with a timeout and DB close
export async function shutdown(signal: string, server: Server) {
  logger.info(`${signal} signal received: closing HTTP server`);

  // Set a timeout to forcefully exit if shutdown takes too long
  const timeout = setTimeout(() => {
    logger.error("Force shutting down server due to timeout.");
    process.exit(1);
  }, 30_000); // 30 seconds timeout

  // Close the server first
  server.close(async () => {
    clearTimeout(timeout);
    logger.info("HTTP server closed");

    // Close the database connection
    try {
      await closeDbConnection();
      logger.info("Database connection closed.");
      process.exit(0);
    } catch (err) {
      logger.error("Error closing database connection:", err);
      process.exit(1);
    }
  });
}
