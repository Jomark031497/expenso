import {
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { AppError } from "./appError.js";

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

export interface TimeRange {
  startDate: Date;
  endDate: Date;
}

// interface CustomDateRange {
//   startDate: string;
//   endDate: string;
// }

export const getTimeRange = (rangeType: TimeRangeType): TimeRange => {
  const now = new Date();
  const yesterday = subDays(now, 1);
  const lastMonth = subMonths(now, 1);
  const lastYear = subYears(now, 1);

  switch (rangeType) {
    case "today":
      return { startDate: startOfDay(now), endDate: endOfDay(now) };
    case "yesterday":
      return { startDate: startOfDay(yesterday), endDate: endOfDay(yesterday) };
    case "last7days":
      return { startDate: startOfDay(subDays(now, 6)), endDate: endOfDay(now) };
    case "last30days":
      return { startDate: startOfDay(subDays(now, 29)), endDate: endOfDay(now) };
    case "thisMonth":
      return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
    case "lastMonth":
      return { startDate: startOfMonth(lastMonth), endDate: endOfMonth(lastMonth) };
    case "thisYear":
      return { startDate: startOfYear(now), endDate: endOfYear(now) };
    case "lastYear":
      return { startDate: startOfYear(lastYear), endDate: endOfYear(lastYear) };
    // case "custom": {
    //   if (!customRange) throw new AppError(400, "Custom range is required for custom type");
    //   const startDate = parseISO(customRange.startDate);
    //   const endDate = parseISO(customRange.endDate);

    //   if (!isValid(startDate) || !isValid(endDate)) {
    //     if (!customRange) throw new AppError(400, "Invalid custom date range");
    //   }
    //   if (startDate > endDate) {
    //     if (!customRange) throw new AppError(400, "Start date must be before end date");
    //   }
    //   return { startDate: startOfDay(startDate), endDate: endOfDay(endDate) };
    // }
    default:
      throw new AppError(400, "Invalid range type");
  }
};
