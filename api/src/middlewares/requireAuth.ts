import type { Request, Response, NextFunction } from "express";
import { lucia } from "../lib/lucia.js";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return res.status(401).json({ message: "Unauthorized: No session found" });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!user) return res.status(401).json({ message: "Unauthorized: No user found" });

  if (session && session.fresh) {
    res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  }
  if (!session) {
    res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }
  res.locals.session = session;
  res.locals.user = user;
  return next();
};
