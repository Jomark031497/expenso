import { logger } from "./utils/logger.js";
import { env } from "./env.js";
import { createApp } from "./app.js";

const main = async () => {
  const app = createApp();

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
