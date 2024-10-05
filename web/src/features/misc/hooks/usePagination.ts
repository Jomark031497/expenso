import type { PaginationState } from "@/features/misc/misc.types";
import { useState } from "react";

type UsePaginationProps = Partial<PaginationState>;
export type PaginationChangeType = (value: UsePaginationProps) => void;

export const usePagination = ({ page = 1, pageSize = 5 }: UsePaginationProps = {}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page,
    pageSize,
  });

  const onPaginationChange = (value: Partial<PaginationState>) => {
    setPagination((prev) => ({
      ...prev,
      ...value,
    }));
  };

  return {
    pagination,
    onPaginationChange,
  };
};
