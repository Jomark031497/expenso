import { useUserSummary } from "@/features/users/hooks/useUserSummary";
import type { TimeRangeType } from "@/features/users/users.types";
import { toCurrency } from "@/utils/toCurrency";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

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

export const UserSummary = () => {
  const [timeRangeType, setTimeRangeType] = useState<TimeRangeType>("thisMonth");

  const { data: userSummary } = useUserSummary(timeRangeType);

  if (!userSummary) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-end">
        <h2 className="text-md flex-1 font-semibold text-textSecondary">Summary</h2>

        <div className="relative">
          <select
            onChange={(e) => setTimeRangeType(e.target.value as TimeRangeType)}
            defaultValue={timeRangeType}
            className={
              "mt-1 block w-full appearance-none rounded border-2 border-gray-200 bg-white px-4 py-1.5 text-sm/6 font-medium text-textPrimary outline-none hover:border-primary focus:border-primary"
            }
          >
            {timeRangeOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <FaChevronDown className="group pointer-events-none absolute right-2.5 top-4 size-4" aria-hidden="true" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1 rounded border bg-white p-4 text-center shadow">
          <p className="mb-2 text-xs font-semibold">Total Expenses</p>
          <p className="text-sm font-semibold text-error">{toCurrency(parseInt(userSummary.expenses))}</p>
        </div>
        <div className="col-span-1 rounded border bg-white p-4 text-center shadow">
          <p className="mb-2 text-xs font-semibold">Total Income</p>
          <p className="text-sm font-semibold text-green-600">{toCurrency(parseInt(userSummary.income))}</p>
        </div>
        <div className="col-span-1 rounded border bg-white p-4 text-center shadow">
          <p className="mb-2 text-xs font-semibold">Total Balance</p>
          <p className="text-sm font-semibold text-blue-600">{toCurrency(userSummary.balance)}</p>
        </div>
      </div>
    </section>
  );
};
