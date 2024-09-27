import { format } from "date-fns";

export const toFormattedDate = (value: Date) => {
  return format(value, "MMM dd, yyyy");
};
