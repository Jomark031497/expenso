import express from "express";
import { logger } from "./utils/logger";
import { env } from "./env";

const main = async () => {
  const app = express();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server started at http://localhost:${env.PORT}`);
  });

  function shutdown(signal: string) {
    logger.info(`${signal} signal received: closing HTTP server`);
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

main().catch((err) => {
  logger.error(err);
});
