import express from "express";
import { initializeRoutes } from "./routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import type { Session, User } from "lucia";
import cors from "cors";
import { env } from "./config/env.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: env.CLIENT_URL,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  initializeRoutes(app);

  app.use(errorHandler);

  return app;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
