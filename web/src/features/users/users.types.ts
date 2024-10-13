export type User = {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
};

export type TimeRangeType =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear";
// | "custom";
