import { logger } from "./utils/logger.js";
import { createApp } from "./app.js";
import { closeDbConnection } from "./db/dbInstance.js"; // Import closeDbConnection
import { envs } from "./config/env.js";

const main = async () => {
  const app = createApp();

  const server = app.listen(envs.PORT, () => {
    logger.info(`Server started at http://localhost:${envs.PORT}`, {
      port: envs.PORT,
    });
  });

  // Graceful shutdown with a timeout and DB close
  async function shutdown(signal: string) {
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

  // Capture termination signals
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception thrown:", err);
    process.exit(1);
  });
};

main().catch((err) => {
  logger.error(err);
});
