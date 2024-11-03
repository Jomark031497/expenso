import { logger } from "./utils/logger.js";
import { createApp } from "./app.js";
import { envs } from "./config/env.js";
import { shutdown } from "./utils/shutdownServer.js";

const main = async () => {
  const app = createApp();

  const server = app.listen(envs.PORT, () => {
    logger.info(`Server started at http://localhost:${envs.PORT}`, {
      port: envs.PORT,
    });
  });

  process.on("SIGINT", () => shutdown("SIGINT", server));
  process.on("SIGTERM", () => shutdown("SIGTERM", server));

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception thrown:", err);
    process.exit(1);
  });
};

main().catch((err) => {
  logger.error(err);
});
