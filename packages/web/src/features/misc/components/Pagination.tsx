import type { PaginationState } from "@/features/misc/misc.types";
import clsx from "clsx";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

type PaginationProps = {
  pagination: PaginationState;
  totalCount: number;
  onPaginationChange: (value: PaginationState) => void;
};

export const Pagination = ({ pagination, totalCount, onPaginationChange }: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1; // Ensure there's at least 1 page.
  const canGetPreviousPage = pagination.page > 1;
  const canGetNextPage = pagination.page < totalPages;

  const handlePreviousPage = () => {
    if (canGetPreviousPage) {
      onPaginationChange({
        ...pagination,
        page: pagination.page - 1,
      });
    }
  };

  const handleNextPage = () => {
    if (canGetNextPage) {
      onPaginationChange({
        ...pagination,
        page: pagination.page + 1,
      });
    }
  };

  return (
    <section className="flex items-center justify-end gap-2 p-2">
      <button
        className={clsx("rounded border p-1", {
          "cursor-not-allowed opacity-50": !canGetPreviousPage,
        })}
        onClick={handlePreviousPage}
        disabled={!canGetPreviousPage}
        aria-label="Previous Page"
      >
        <FaAngleLeft />
      </button>
      <span className="flex items-center gap-1 text-xs md:text-base">
        <div>Page</div>
        <strong>
          {totalCount > 0 ? pagination.page : 0} of {totalCount > 0 ? totalPages : 0}
        </strong>
      </span>
      <button
        className={clsx("rounded border p-1", {
          "cursor-not-allowed opacity-50": !canGetNextPage,
        })}
        onClick={handleNextPage}
        disabled={!canGetNextPage}
        aria-label="Next Page"
      >
        <FaAngleRight />
      </button>
    </section>
  );
};
