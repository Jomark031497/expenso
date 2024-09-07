import type { Express } from "express";
import { usersRouter } from "./domains/users/users.routes.js";
import { authRouter } from "./domains/auth/auth.routes.js";

export const initializeRoutes = (app: Express) => {
  app.use("/api/healthcheck", (_req, res) => {
    return res.status(200).send("OK");
  });

  app.use("/api/users", usersRouter);
  app.use("/api/auth", authRouter);

  app.use("*", (req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
  });
};
