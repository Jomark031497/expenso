import type { Request, Response, NextFunction } from "express";
import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "../lib/sessions.js";
import { parseCookies } from "oslo/cookie";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = parseCookies(req.headers.cookie ?? "");
  const token = cookies.get("session") ?? "";

  const { session, user } = await validateSessionToken(token);

  if (session === null) {
    deleteSessionTokenCookie(res);
    return res.status(401).end();
  }

  setSessionTokenCookie(res, token, session.expiresAt);

  res.locals.session = session;
  res.locals.user = user;

  next();
};
