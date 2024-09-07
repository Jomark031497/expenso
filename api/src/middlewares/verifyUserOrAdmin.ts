import type { Request, Response, NextFunction } from "express";

export const verifyUserOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const currentUser = res.locals.user; // The user making the request
  const userIdToModify = req.params.id; // The user being updated or deleted

  if (!currentUser) return res.status(403).json({ message: "Forbidden: You can only modify your own account" });

  // Allow if the user is either the owner of the account or an admin
  if (currentUser.id !== userIdToModify && currentUser.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: You can only modify your own account" });
  }

  next();
};
