import type { NextFunction, Request, Response } from "express";
import type { Session, User } from "lucia";
import { lucia } from "../lib/lucia.js";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) return res.status(401).json({ message: "Unauthorized: No session found." });

  const { session, user } = await lucia.validateSession(sessionId);

  if (!user) return res.status(401).json({ message: "Unauthorized: No session found." });

  if (session && session.fresh) {
    res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  }
  if (!session) {
    res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }
  res.locals.user = user;
  res.locals.session = session;
  return next();
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
