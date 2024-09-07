import type { Request, Response, NextFunction } from "express";
import { lucia } from "../lib/lucia.js";
import { logger } from "../utils/logger.js"; // Assuming logger exists for logging
import { logger } from "../utils/logger.js"; // Assuming logger exists for logging

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Read session cookie from headers
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
    if (!sessionId) {
      res.locals.user = null;
      res.locals.session = null;
      return res.status(401).json({ message: "Unauthorized: No session found" });
    }

    // Validate session and user
    const { session, user } = await lucia.validateSession(sessionId);
    // Validate session and user
    const { session, user } = await lucia.validateSession(sessionId);

    if (!user) {
      res.locals.user = null;
      res.locals.session = null;
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Set or refresh session cookies
    if (session && session.fresh) {
      res.setHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    }
    if (!session) {
      res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
    }

    // Store session and user in res.locals for further use
    res.locals.session = session;
    res.locals.user = user;
    return next();
  } catch (error) {
    // Log the error for debugging
    logger.error("Error in requireAuth middleware:", error);

    // Respond with a 500 Internal Server Error in case of unexpected errors
    return res.status(500).json({ message: "Internal server error" });
  }
};
