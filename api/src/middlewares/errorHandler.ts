import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (error: AppError | Error, _req: Request, res: Response, next: NextFunction) => {
  if (!error) next();

  logger.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors,
    });
  }

  return res.status(500).json({ message: "Something went wrong" });
};
