import type { User } from "../domains/users/users.schema.ts";

declare global {
  namespace Express {
    interface Locals {
      user: User;
      session: {
        id: string;
        userId: string;
        expiresAt: Date;
      };
    }
  }
}
