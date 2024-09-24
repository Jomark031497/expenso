import type { Request, Response, NextFunction } from "express";

export const requireAdmin = (_req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};
