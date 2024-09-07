import express from "express";
import { initializeRoutes } from "./routes";

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  initializeRoutes(app);

  return app;
};
