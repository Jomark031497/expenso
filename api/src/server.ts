import express from "express";
import { logger } from "./utils/logger";
import { env } from "./env";

const main = async () => {
  const app = express();

  app.listen(env.PORT, () => {
    logger.info(`Server started at http://localhost:${env.PORT}`);
  });
};

main().catch((err) => {
  logger.error(err);
});
