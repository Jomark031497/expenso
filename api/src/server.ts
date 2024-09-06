import express from "express";
import { logger } from "./utils/logger.js";
import { env } from "./env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { initializeRoutes } from "./routes.js";

const main = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  initializeRoutes(app);

  app.use(errorHandler);

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
