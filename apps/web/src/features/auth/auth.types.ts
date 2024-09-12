import type { User } from "@/features/users/users.types";

export interface SignUpUser extends Omit<User, "createdAt" | "updatedAt" | "role"> {
  password: string;
}
