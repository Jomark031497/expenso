import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";
import { AppError } from "../../utils/appError.js";

export const loginUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionCookie, user } = await authService.loginUser(req.body);

    return res
      .status(200)
      .cookie(sessionCookie.name, sessionCookie.value, { ...sessionCookie.attributes, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json(user);
  } catch (error) {
    return next(error);
  }
};

export const signUpUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionCookie, user } = await authService.signUpUser(req.body);
    return res
      .status(201)
      .cookie(sessionCookie.name, sessionCookie.value, { ...sessionCookie.attributes, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json(user);
  } catch (error) {
    return next(error);
  }
};

export const getAuthenticatedUserHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) throw new AppError(403, "forbidden: no session found");

    const data = await authService.getAuthenticatedUser(user.id);

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const logoutUserHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const session = res.locals.session;
    if (!session) throw new AppError(403, "forbidden: no session found");

    const data = await authService.logoutUser(session.id);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
