export type User = {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
};
