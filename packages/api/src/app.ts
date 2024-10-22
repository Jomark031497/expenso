import express from "express";
import { initializeRoutes } from "./routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import { envs } from "./config/env.js";
import { csrf } from "./middlewares/csrf.js";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: envs.CLIENT_URL,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: process.env.NODE_ENV === "development" ? 10_000 : 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    }),
  );

  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(csrf);

  initializeRoutes(app);

  app.use(errorHandler);

  return app;
};
