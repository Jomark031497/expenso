import type { User } from "../users/users.types";

export type LoginUser = {
  password: string;
} & Pick<User, "username">;

export interface SignUpUser extends Omit<User, "createdAt" | "updatedAt" | "role"> {
  password: string;
}
