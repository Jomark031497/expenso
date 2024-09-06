import type { Express } from "express";
import { usersRouter } from "./domains/users/users.routes.js";

export const initializeRoutes = (app: Express) => {
  app.use("/api/healthcheck", (_req, res) => {
    return res.status(200).send("OK");
  });

  app.use("/api/users", usersRouter);
};
