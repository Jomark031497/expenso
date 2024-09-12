import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (error: AppError | Error, _req: Request, res: Response, next: NextFunction) => {
  if (!error) return next();

  logger.error({
    message: error.message,
    stack: error.stack,
    ...(error instanceof AppError ? { statusCode: error.statusCode, errors: error.errors } : {}),
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors || null,
    });
  }

  return res.status(500).json({
    message: "Something went wrong",
  });
};
