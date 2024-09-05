import express from "express";
import { logger } from "./utils/logger";

const main = async () => {
  const app = express();

  app.listen(process.env.PORT, () => {
    logger.info(`Server started at http://localhost:${process.env.PORT}`);
  });
};

main().catch((err) => {
  logger.error(err);
});
