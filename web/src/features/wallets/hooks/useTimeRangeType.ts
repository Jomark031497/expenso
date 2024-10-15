import type { TimeRangeType } from "@/features/users/users.types";
import { useState } from "react";

export const useTimeRangeType = (initialState: TimeRangeType = "thisMonth") => {
  const [timeRangeType, setTimeRangeType] = useState<TimeRangeType>(initialState);

  const timeRangeOptions: { value: TimeRangeType; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last7days", label: "Last 7 Days" },
    { value: "last30days", label: "Last 30 Days" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "thisYear", label: "This Year" },
    { value: "lastYear", label: "Last Year" },
  ];

  return { timeRangeType, setTimeRangeType, timeRangeOptions };
};
