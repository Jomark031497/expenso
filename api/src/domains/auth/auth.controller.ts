import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";
import { AppError } from "../../utils/appError.js";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  setSessionTokenCookie,
} from "../../lib/sessions.js";

export const loginUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.loginUser(req.body);

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionTokenCookie(res, token, session.expiresAt);

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

export const signUpUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.signUpUser(req.body);

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionTokenCookie(res, token, session.expiresAt);

    return res.status(201).json(user);
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

    deleteSessionTokenCookie(res);
    return res.status(200).json({ message: "logout success" });
  } catch (error) {
    return next(error);
  }
};
