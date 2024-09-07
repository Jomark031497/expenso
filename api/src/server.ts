import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";

const main = async () => {
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server started at http://localhost:${env.PORT}`);
  });

  function shutdown(signal: string) {
    logger.info(`${signal} signal received: closing HTTP server`);

    // Set a timeout to force close after 30 seconds
    const timeout = setTimeout(() => {
      logger.error("Force shutting down server due to timeout.");
      process.exit(1);
    }, 30_000); // 30 seconds

    server.close(() => {
      clearTimeout(timeout);
      logger.info("HTTP server closed");
      process.exit(0);
    });
  }

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
